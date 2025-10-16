import dotenv from 'dotenv';
import { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import fs from 'fs';

dotenv.config({ path: '.env.devnet' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/devnet';
const DEVNET_RPC = 'https://api.devnet.solana.com';

// Jito TESTNET/DEVNET tip accounts (official Jito testnet addresses)
// Source: https://jito-foundation.gitbook.io/mev/mev-payment-and-distribution/on-chain-addresses
const JITO_TIP_ACCOUNTS = [
  'B1mrQSpdeMU9gCvkJ6VsXVVoYjRGkNA7TtjMyqxrhecH',
  'aTtUk2DHgLhKZRDjePq6eiHRKC1XXFMBiSUfQ2JNDbN',
  'E2eSqe33tuhAHKTrwky5uEjaVqnb2T9ns6nHHUrN8588',
  '4xgEmT58RwTNsF5xm2RMYCnR1EVukdK8a1i2qFjnJFu3',
  'EoW3SUQap7ZeynXQ2QJ847aerhxbPVr843uMeTfc9dxM',
  'ARTtviJkLLt6cHGQDydfo1Wyk6M4VGZdKZ2ZhdnJL336',
  '9n3d1K5YD2vECAbRFhFFGYNNjiXtHXJWn9F31t89vsAV',
  '9ttgPBBhRYFuQccdR1DSnb7hydsWANoDsV3P9kaGMCEh',
];

async function testWithTip() {
  console.log('🎯 Testing Gateway with Jito Tip Instruction\n');
  console.log('='.repeat(70));

  try {
    // Setup
    const walletPath = '/Users/rz/local-dev/sanctum-gateway-track/devnet-wallet.json';
    const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    const connection = new Connection(DEVNET_RPC, 'confirmed');

    console.log(`\n📂 Wallet: ${wallet.publicKey.toBase58()}`);

    const recipientKeypair = Keypair.generate();
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    // Create transaction with BOTH transfer AND tip
    console.log(`\n🏗️  Building transaction with Jito tip...`);

    const tipAccount = new PublicKey(JITO_TIP_ACCOUNTS[0]);
    const tipAmount = 0.0001 * LAMPORTS_PER_SOL; // 0.0001 SOL tip

    const transaction = new Transaction({
      feePayer: wallet.publicKey,
      blockhash,
      lastValidBlockHeight,
    });

    // Add main transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientKeypair.publicKey,
        lamports: 0.001 * LAMPORTS_PER_SOL,
      })
    );

    // Add Jito tip instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: tipAccount,
        lamports: tipAmount,
      })
    );

    console.log(`✅ Transaction built with 2 instructions:`);
    console.log(`   1. Transfer 0.001 SOL to ${recipientKeypair.publicKey.toBase58().substring(0, 20)}...`);
    console.log(`   2. Tip 0.0001 SOL to ${tipAccount.toBase58().substring(0, 20)}...`);

    // Sign
    transaction.sign(wallet);

    // Serialize
    const serialized = transaction.serialize({ requireAllSignatures: true });
    const base64Tx = serialized.toString('base64');

    console.log(`\n📦 Serialized: ${serialized.length} bytes`);

    // Test with sendTransaction
    console.log(`\n🚀 Sending to Gateway via sendTransaction...`);

    const response = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'sendTransaction',
        params: [base64Tx, { encoding: 'base64' }]
      })
    });

    const data = await response.json();

    console.log(`\n📥 Gateway Response:`);
    console.log(JSON.stringify(data, null, 2));

    if (data.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS! Transaction submitted!`);
      console.log(`Signature: ${data.result}`);

      // Wait and check status
      console.log(`\n⏳ Waiting for confirmation...`);
      await new Promise(resolve => setTimeout(resolve, 5000));

      const signature = data.result;
      const status = await connection.getSignatureStatus(signature);
      console.log(`Status:`, status);

      return true;
    } else if (data.error) {
      console.log(`\n❌ Error: ${data.error.message}`);
      console.log(`Code: ${data.error.code}`);
      if (data.error.data) {
        console.log(`Data:`, data.error.data);
      }
      return false;
    }

    return false;
  } catch (error) {
    console.error(`\n💥 Test failed:`, error);
    return false;
  }
}

testWithTip()
  .then(success => {
    console.log('\n' + '='.repeat(70));
    if (success) {
      console.log('🎉 GATEWAY INTEGRATION WORKING!');
      console.log('We successfully submitted a transaction through Gateway!');
    } else {
      console.log('⚠️  Still troubleshooting...');
    }
    console.log('='.repeat(70));
    process.exit(success ? 0 : 1);
  });

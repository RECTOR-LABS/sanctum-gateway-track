import dotenv from 'dotenv';
import { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import fs from 'fs';

dotenv.config({ path: '.env.devnet' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/devnet';
const DEVNET_RPC = 'https://api.devnet.solana.com';

const JITO_TIP_ACCOUNTS = [
  'B1mrQSpdeMU9gCvkJ6VsXVVoYjRGkNA7TtjMyqxrhecH',
  'aTtUk2DHgLhKZRDjePq6eiHRKC1XXFMBiSUfQ2JNDbN',
];

async function testTipFirst() {
  console.log('🧪 Testing with TIP INSTRUCTION FIRST\n');
  console.log('='.repeat(70));

  try {
    const walletPath = '/Users/rz/local-dev/sanctum-gateway-track/devnet-wallet.json';
    const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    const connection = new Connection(DEVNET_RPC, 'confirmed');

    console.log(`\n📂 Wallet: ${wallet.publicKey.toBase58()}`);

    const recipientKeypair = Keypair.generate();
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const tipAccount = new PublicKey(JITO_TIP_ACCOUNTS[0]);
    const tipAmount = 1000; // Minimum 1000 lamports

    const transaction = new Transaction({
      feePayer: wallet.publicKey,
      blockhash,
      lastValidBlockHeight,
    });

    // Add TIP FIRST
    console.log(`\n🏗️  Building transaction: TIP FIRST, then transfer...`);
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: tipAccount,
        lamports: tipAmount,
      })
    );

    // Then add main transfer
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientKeypair.publicKey,
        lamports: 0.001 * LAMPORTS_PER_SOL,
      })
    );

    console.log(`✅ Instructions:`);
    console.log(`   1. Tip ${tipAmount} lamports to ${tipAccount.toBase58().substring(0, 20)}...`);
    console.log(`   2. Transfer 0.001 SOL to ${recipientKeypair.publicKey.toBase58().substring(0, 20)}...`);

    transaction.sign(wallet);
    const serialized = transaction.serialize({ requireAllSignatures: true });
    const base64Tx = serialized.toString('base64');

    console.log(`\n📦 Serialized: ${serialized.length} bytes`);

    // Send to Gateway
    console.log(`\n🚀 Sending to Gateway...`);
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
    console.log(`\n📥 Response:`, JSON.stringify(data, null, 2));

    if (data.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS!`);
      console.log(`Signature: ${data.result}`);
      return true;
    }

    // Try with larger tip amount
    console.log(`\n🚀 Attempt 2: Larger tip (10,000 lamports)...`);

    const transaction2 = new Transaction({
      feePayer: wallet.publicKey,
      blockhash,
      lastValidBlockHeight,
    });

    transaction2.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: tipAccount,
        lamports: 10000, // 10x minimum
      })
    );

    transaction2.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientKeypair.publicKey,
        lamports: 0.001 * LAMPORTS_PER_SOL,
      })
    );

    transaction2.sign(wallet);
    const serialized2 = transaction2.serialize({ requireAllSignatures: true });
    const base64Tx2 = serialized2.toString('base64');

    const response2 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'sendTransaction',
        params: [base64Tx2, { encoding: 'base64' }]
      })
    });

    const data2 = await response2.json();
    console.log(`\nResponse:`, JSON.stringify(data2, null, 2));

    if (data2.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS with larger tip!`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`\n💥 Error:`, error);
    return false;
  }
}

testTipFirst()
  .then(success => {
    console.log('\n' + '='.repeat(70));
    console.log(success ? '🎉 SUCCESS!' : '⚠️  Still troubleshooting...');
    console.log('='.repeat(70));
    process.exit(success ? 0 : 1);
  });

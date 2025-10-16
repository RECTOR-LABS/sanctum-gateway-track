import dotenv from 'dotenv';
import { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import fs from 'fs';

dotenv.config({ path: '.env' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/mainnet';
const MAINNET_RPC = 'https://api.mainnet-beta.solana.com';

// Jito MAINNET tip accounts (official)
const JITO_TIP_ACCOUNTS = [
  '96gYZGLnJYVFmbjzopPSU6QiEV5fGqZNyN9nmNhvrZU5',
  'HFqU5x63VTqvQss8hp11i4wVV8bD44PvwucfZ2bU7gRe',
  'Cw8CFyM9FkoMi7K7Crf6HNQqf4uEMzpKw6QNghXLvLkY',
  'ADaUMid9yfUytqMBgopwjb2DTLSokTSzL1zt6iGPaS49',
  'DfXygSm4jCyNCybVYYK6DwvWqjKee8pbDmJGcLWNDXjh',
  'ADuUkR4vqLUMWXxW9gh6D6L8pMSawimctcNZ5pGwDcEt',
  'DttWaMuVvTiduZRnguLF7jNxTgiMBZ1hyAumKUiL2KRL',
  '3AVi9Tg9Uo68tJfuvoKvqKNWKkC5wPdSSdeBnizKZ6jT',
];

async function testMainnetGateway() {
  console.log('🚀 TESTING GATEWAY ON MAINNET WITH JITO\n');
  console.log('='.repeat(70));

  try {
    // Load mainnet wallet
    const walletPath = '/Users/rz/local-dev/sanctum-gateway-track/mainnet-wallet.json';
    const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    const connection = new Connection(MAINNET_RPC, 'confirmed');

    console.log(`\n📂 Wallet: ${wallet.publicKey.toBase58()}`);

    // Check balance
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`💰 Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    if (balance < 0.001 * LAMPORTS_PER_SOL) {
      throw new Error('Insufficient balance for test transaction');
    }

    // Create transaction
    console.log(`\n🏗️  Building transaction with Jito tip...`);
    const recipientKeypair = Keypair.generate();
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const tipAccount = new PublicKey(JITO_TIP_ACCOUNTS[0]);
    const tipAmount = 10000; // 0.00001 SOL (minimum tip)

    const transaction = new Transaction({
      feePayer: wallet.publicKey,
      blockhash,
      lastValidBlockHeight,
    });

    // Add Jito tip instruction FIRST
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

    console.log(`✅ Transaction built with 2 instructions:`);
    console.log(`   1. Tip ${tipAmount / LAMPORTS_PER_SOL} SOL to ${tipAccount.toBase58().substring(0, 20)}...`);
    console.log(`   2. Transfer 0.001 SOL to ${recipientKeypair.publicKey.toBase58().substring(0, 20)}...`);

    // Sign
    transaction.sign(wallet);

    // Serialize
    const serialized = transaction.serialize({ requireAllSignatures: true });
    const base64Tx = serialized.toString('base64');

    console.log(`\n📦 Serialized: ${serialized.length} bytes`);
    console.log(`📝 First 80 chars: ${base64Tx.substring(0, 80)}...`);

    // Send to Gateway
    console.log(`\n🚀 Sending to Gateway via sendTransaction...`);
    console.log(`   URL: ${GATEWAY_BASE_URL}`);
    console.log(`   Method: sendTransaction`);

    const startTime = Date.now();

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

    const responseTime = Date.now() - startTime;
    const data = await response.json();

    console.log(`\n📥 Gateway Response (${responseTime}ms):`);
    console.log(JSON.stringify(data, null, 2));

    if (data.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS! Transaction submitted through Gateway!`);
      console.log(`\nSignature: ${data.result}`);
      console.log(`\nView on Solscan: https://solscan.io/tx/${data.result}`);

      // Wait and check status
      console.log(`\n⏳ Waiting 10 seconds for confirmation...`);
      await new Promise(resolve => setTimeout(resolve, 10000));

      const signature = data.result;
      const status = await connection.getSignatureStatus(signature);
      console.log(`\n📊 Transaction Status:`);
      console.log(JSON.stringify(status, null, 2));

      if (status.value?.confirmationStatus) {
        console.log(`\n🎉 Transaction confirmed with status: ${status.value.confirmationStatus}`);
      }

      return { success: true, signature: data.result };
    } else if (data.error) {
      console.log(`\n❌ Gateway Error:`);
      console.log(`   Message: ${data.error.message}`);
      console.log(`   Code: ${data.error.code}`);
      if (data.error.data) {
        console.log(`   Data:`, JSON.stringify(data.error.data));
      }
      return { success: false, error: data.error };
    }

    return { success: false };
  } catch (error) {
    console.error(`\n💥 Test failed:`, error);
    return { success: false, error };
  }
}

testMainnetGateway()
  .then(result => {
    console.log('\n' + '='.repeat(70));
    if (result.success) {
      console.log('🎉 🎉 🎉 GATEWAY INTEGRATION WORKING ON MAINNET! 🎉 🎉 🎉');
      console.log('\n✅ Successfully sent transaction through Gateway with Jito!');
      console.log('\n📋 Next Steps:');
      console.log('   1. Update integration code with working patterns');
      console.log('   2. Start building Gateway Insights application');
      console.log('   3. Implement analytics and dashboard features');
    } else {
      console.log('⚠️  Transaction failed - see error details above');
    }
    console.log('='.repeat(70));
    process.exit(result.success ? 0 : 1);
  });

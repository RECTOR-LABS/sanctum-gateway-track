import dotenv from 'dotenv';
import { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';

dotenv.config({ path: '.env.devnet' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/devnet';
const DEVNET_RPC = 'https://api.devnet.solana.com';

async function testSimpleSendTransaction() {
  console.log('🎯 Testing Simple sendTransaction (No Manual Tip)\n');
  console.log('='.repeat(70));

  try {
    // Setup
    const walletPath = '/Users/rz/local-dev/sanctum-gateway-track/devnet-wallet.json';
    const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    const connection = new Connection(DEVNET_RPC, 'confirmed');

    console.log(`\n📂 Wallet: ${wallet.publicKey.toBase58()}`);

    // Check balance
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`💰 Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    const recipientKeypair = Keypair.generate();
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    // Create simple transaction - just one transfer
    console.log(`\n🏗️  Building transaction with single transfer...`);

    const transaction = new Transaction({
      feePayer: wallet.publicKey,
      blockhash,
      lastValidBlockHeight,
    });

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientKeypair.publicKey,
        lamports: 0.001 * LAMPORTS_PER_SOL, // Just 0.001 SOL
      })
    );

    console.log(`✅ Transaction: ${wallet.publicKey.toBase58().substring(0, 10)}... → ${recipientKeypair.publicKey.toBase58().substring(0, 10)}... (0.001 SOL)`);

    // Sign
    transaction.sign(wallet);

    // Serialize
    const serialized = transaction.serialize({ requireAllSignatures: true });
    const base64Tx = serialized.toString('base64');

    console.log(`📦 Serialized: ${serialized.length} bytes`);
    console.log(`📝 Base64 (first 60 chars): ${base64Tx.substring(0, 60)}...`);

    // Try 1: Standard sendTransaction with encoding
    console.log(`\n🚀 Attempt 1: sendTransaction with encoding parameter...`);
    const response1 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'sendTransaction',
        params: [base64Tx, { encoding: 'base64' }]
      })
    });

    const data1 = await response1.json();
    console.log(`Response:`, JSON.stringify(data1, null, 2));

    if (data1.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS!`);
      console.log(`Signature: ${data1.result}`);
      return { success: true, signature: data1.result };
    }

    // Try 2: sendTransaction without encoding parameter
    console.log(`\n🚀 Attempt 2: sendTransaction without encoding parameter...`);
    const response2 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'sendTransaction',
        params: [base64Tx]
      })
    });

    const data2 = await response2.json();
    console.log(`Response:`, JSON.stringify(data2, null, 2));

    if (data2.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS!`);
      console.log(`Signature: ${data2.result}`);
      return { success: true, signature: data2.result };
    }

    // Try 3: With skipPreflight and other standard options
    console.log(`\n🚀 Attempt 3: With skipPreflight=false...`);
    const response3 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'sendTransaction',
        params: [base64Tx, {
          encoding: 'base64',
          skipPreflight: false,
          preflightCommitment: 'confirmed'
        }]
      })
    });

    const data3 = await response3.json();
    console.log(`Response:`, JSON.stringify(data3, null, 2));

    if (data3.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS!`);
      console.log(`Signature: ${data3.result}`);
      return { success: true, signature: data3.result };
    }

    console.log(`\n❌ All attempts failed`);
    return { success: false };

  } catch (error) {
    console.error(`\n💥 Error:`, error);
    return { success: false };
  }
}

testSimpleSendTransaction()
  .then(async result => {
    console.log('\n' + '='.repeat(70));

    if (result.success && result.signature) {
      console.log('🎉 TRANSACTION SENT SUCCESSFULLY!');
      console.log(`\nSignature: ${result.signature}`);
      console.log(`\nWaiting 5 seconds before checking status...`);

      await new Promise(resolve => setTimeout(resolve, 5000));

      const connection = new Connection(DEVNET_RPC, 'confirmed');
      const status = await connection.getSignatureStatus(result.signature);
      console.log(`\nStatus:`, status);
    } else {
      console.log('⚠️  Transaction submission failed');
    }

    console.log('='.repeat(70));
    process.exit(result.success ? 0 : 1);
  });

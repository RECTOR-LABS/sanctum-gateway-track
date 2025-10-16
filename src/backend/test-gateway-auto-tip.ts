import dotenv from 'dotenv';
import { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';

dotenv.config({ path: '.env.devnet' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/devnet';
const DEVNET_RPC = 'https://api.devnet.solana.com';

async function testGatewayAutoTip() {
  console.log('🧪 Testing Gateway with Automatic Tip Handling\n');
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

    // Create transaction with ONLY the transfer (no manual tip)
    console.log(`\n🏗️  Building simple transaction (no manual tip)...`);

    const transaction = new Transaction({
      feePayer: wallet.publicKey,
      blockhash,
      lastValidBlockHeight,
    });

    // Add ONLY the main transfer instruction
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientKeypair.publicKey,
        lamports: 0.001 * LAMPORTS_PER_SOL,
      })
    );

    console.log(`✅ Transaction built with 1 instruction:`);
    console.log(`   Transfer 0.001 SOL to ${recipientKeypair.publicKey.toBase58().substring(0, 20)}...`);

    // Sign
    transaction.sign(wallet);

    // Serialize
    const serialized = transaction.serialize({ requireAllSignatures: true });
    const base64Tx = serialized.toString('base64');

    console.log(`\n📦 Serialized: ${serialized.length} bytes`);

    // Test with optimizeTransaction + jitoTip parameter
    console.log(`\n🚀 Attempt 1: optimizeTransaction with jitoTip='low'...`);

    const response1 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'optimizeTransaction',
        params: {
          transactions: [{ params: [base64Tx] }],
          jitoTip: 'low'
        }
      })
    });

    const data1 = await response1.json();
    console.log(`\n📥 Response 1:`, JSON.stringify(data1, null, 2));

    if (data1.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS with optimizeTransaction!`);
      return true;
    }

    // Try simpler format
    console.log(`\n🚀 Attempt 2: Simpler params format with jitoTip...`);

    const response2 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'optimizeTransaction',
        params: [base64Tx, { jitoTip: 'low' }]
      })
    });

    const data2 = await response2.json();
    console.log(`\n📥 Response 2:`, JSON.stringify(data2, null, 2));

    if (data2.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS with simpler format!`);
      return true;
    }

    // Try with deliveryMethods specified
    console.log(`\n🚀 Attempt 3: With explicit deliveryMethods=['jito']...`);

    const response3 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'optimizeTransaction',
        params: {
          transactions: [{ params: [base64Tx] }],
          jitoTip: 'low',
          deliveryMethods: ['jito']
        }
      })
    });

    const data3 = await response3.json();
    console.log(`\n📥 Response 3:`, JSON.stringify(data3, null, 2));

    if (data3.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS with explicit delivery methods!`);
      return true;
    }

    // Try with RPC-only delivery (no Jito)
    console.log(`\n🚀 Attempt 4: RPC-only delivery (no Jito tip)...`);

    const response4 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 4,
        method: 'optimizeTransaction',
        params: {
          transactions: [{ params: [base64Tx] }],
          deliveryMethods: ['rpc']
        }
      })
    });

    const data4 = await response4.json();
    console.log(`\n📥 Response 4:`, JSON.stringify(data4, null, 2));

    if (data4.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS with RPC-only delivery!`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`\n💥 Test failed:`, error);
    return false;
  }
}

testGatewayAutoTip()
  .then(success => {
    console.log('\n' + '='.repeat(70));
    if (success) {
      console.log('🎉 GATEWAY INTEGRATION WORKING!');
    } else {
      console.log('⚠️  All attempts failed - need to investigate further');
    }
    console.log('='.repeat(70));
    process.exit(success ? 0 : 1);
  });

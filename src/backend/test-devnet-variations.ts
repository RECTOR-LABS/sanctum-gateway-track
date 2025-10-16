import dotenv from 'dotenv';
import { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';

dotenv.config({ path: '.env.devnet' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/devnet';
const DEVNET_RPC = 'https://api.devnet.solana.com';

async function testAllFormats() {
  console.log('🔬 Testing ALL Gateway API Format Variations\n');
  console.log('='.repeat(70));

  // Setup
  const walletPath = '/Users/rz/local-dev/sanctum-gateway-track/devnet-wallet.json';
  const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
  const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));
  const connection = new Connection(DEVNET_RPC, 'confirmed');

  const recipientKeypair = Keypair.generate();
  const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

  const transaction = new Transaction({
    feePayer: wallet.publicKey,
    blockhash,
    lastValidBlockHeight,
  }).add(
    SystemProgram.transfer({
      fromPubkey: wallet.publicKey,
      toPubkey: recipientKeypair.publicKey,
      lamports: 0.001 * LAMPORTS_PER_SOL,
    })
  );

  transaction.sign(wallet);
  const serialized = transaction.serialize({ requireAllSignatures: true });
  const base64Tx = serialized.toString('base64');

  console.log(`\n📦 Transaction prepared: ${base64Tx.substring(0, 60)}...\n`);

  const testCases = [
    // Test 1: Standard Solana sendTransaction
    {
      name: 'Standard Solana sendTransaction',
      body: {
        jsonrpc: '2.0',
        id: 1,
        method: 'sendTransaction',
        params: [base64Tx, { encoding: 'base64' }]
      }
    },

    // Test 2: sendTransaction without encoding param
    {
      name: 'sendTransaction (no encoding)',
      body: {
        jsonrpc: '2.0',
        id: 2,
        method: 'sendTransaction',
        params: [base64Tx]
      }
    },

    // Test 3: optimizeTransaction with params array
    {
      name: 'optimizeTransaction (params array)',
      body: {
        jsonrpc: '2.0',
        id: 3,
        method: 'optimizeTransaction',
        params: [base64Tx]
      }
    },

    // Test 4: optimizeTransaction with object params
    {
      name: 'optimizeTransaction (object params)',
      body: {
        jsonrpc: '2.0',
        id: 4,
        method: 'optimizeTransaction',
        params: {
          transaction: base64Tx
        }
      }
    },

    // Test 5: optimizeTransaction with transactions array (simple)
    {
      name: 'optimizeTransaction (transactions array)',
      body: {
        jsonrpc: '2.0',
        id: 5,
        method: 'optimizeTransaction',
        params: {
          transactions: [base64Tx]
        }
      }
    },

    // Test 6: As documented (nested params)
    {
      name: 'optimizeTransaction (nested params)',
      body: {
        jsonrpc: '2.0',
        id: 6,
        method: 'optimizeTransaction',
        params: {
          transactions: [{ params: [base64Tx] }]
        }
      }
    },

    // Test 7: With serialization type specified
    {
      name: 'optimizeTransaction (with encoding)',
      body: {
        jsonrpc: '2.0',
        id: 7,
        method: 'optimizeTransaction',
        params: {
          transactions: [base64Tx],
          encoding: 'base64'
        }
      }
    },

    // Test 8: Array of transactions at root
    {
      name: 'optimizeTransaction (root array)',
      body: {
        jsonrpc: '2.0',
        id: 8,
        method: 'optimizeTransaction',
        params: [
          { transaction: base64Tx }
        ]
      }
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🧪 Test: ${testCase.name}`);
    console.log(`   Request:`, JSON.stringify(testCase.body, null, 2).substring(0, 200) + '...');

    try {
      const response = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCase.body)
      });

      const data = await response.json();

      if (data.result) {
        console.log(`   ✅ ✅ ✅ SUCCESS!`);
        console.log(`   Result:`, JSON.stringify(data.result, null, 2));
        console.log(`\n🎉 FOUND THE RIGHT FORMAT: "${testCase.name}"`);
        return { success: true, format: testCase.name, data };
      } else if (data.error) {
        console.log(`   ❌ Error ${data.error.code}: ${data.error.message}`);
        if (data.error.data) {
          console.log(`      Data:`, JSON.stringify(data.error.data));
        }
      } else {
        console.log(`   ⚠️  Unexpected response:`, JSON.stringify(data));
      }
    } catch (error) {
      console.log(`   💥 Request failed:`, error instanceof Error ? error.message : error);
    }
  }

  return { success: false };
}

testAllFormats()
  .then(result => {
    console.log('\n' + '='.repeat(70));
    if (result.success) {
      console.log(`✅ TEST PASSED - Working format found!`);
    } else {
      console.log(`⚠️  All ${8} format variations failed`);
      console.log(`   This likely means:`);
      console.log(`   1. Gateway API might be different than documented`);
      console.log(`   2. Our API key might not have the right permissions`);
      console.log(`   3. The devnet endpoint might work differently`);
      console.log(`   4. We may need to ask Sanctum for clarification`);
    }
    console.log('='.repeat(70));
    process.exit(result.success ? 0 : 1);
  });

import dotenv from 'dotenv';
import { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';

// Load devnet environment
dotenv.config({ path: '.env.devnet' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/devnet';
const DEVNET_RPC = 'https://api.devnet.solana.com';

async function testDevnetGateway() {
  console.log('🧪 Gateway Devnet Integration Test\n');
  console.log('='.repeat(70));

  try {
    // Load the funded wallet
    console.log('\n📂 Step 1: Loading devnet wallet...');
    const walletPath = '/Users/rz/local-dev/sanctum-gateway-track/devnet-wallet.json';
    const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    console.log(`✅ Wallet loaded: ${wallet.publicKey.toBase58()}`);

    // Check balance
    console.log('\n💰 Step 2: Checking wallet balance...');
    const connection = new Connection(DEVNET_RPC, 'confirmed');
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`✅ Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    if (balance === 0) {
      throw new Error('Wallet has no balance! Please airdrop SOL first.');
    }

    // Create a simple transaction
    console.log('\n🏗️  Step 3: Building test transaction...');
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

    console.log(`✅ Transaction built`);
    console.log(`   From: ${wallet.publicKey.toBase58()}`);
    console.log(`   To: ${recipientKeypair.publicKey.toBase58()}`);
    console.log(`   Amount: 0.001 SOL`);

    // Sign the transaction
    console.log('\n✍️  Step 4: Signing transaction...');
    transaction.sign(wallet);
    console.log('✅ Transaction signed');

    // Serialize
    console.log('\n📦 Step 5: Serializing transaction...');
    const serialized = transaction.serialize({
      requireAllSignatures: true,
      verifySignatures: true,
    });
    const base64Tx = serialized.toString('base64');
    console.log(`✅ Serialized (${serialized.length} bytes)`);
    console.log(`   Base64 (first 80 chars): ${base64Tx.substring(0, 80)}...`);

    // Try different Gateway API formats to find the right one
    console.log('\n🚀 Step 6: Testing Gateway API formats...\n');

    // Format 1: Minimal (just the transaction)
    console.log('📋 Format 1: Minimal request...');
    const format1 = {
      jsonrpc: '2.0',
      id: 1,
      method: 'optimizeTransaction',
      params: {
        transactions: [
          { params: [base64Tx] }
        ]
      }
    };

    const response1 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(format1)
    });

    const data1 = await response1.json();
    console.log('Response:', JSON.stringify(data1, null, 2));

    if (data1.result) {
      console.log('\n✅ ✅ ✅ SUCCESS! Gateway accepted the transaction!');
      console.log(`Signature: ${data1.result.signature || 'N/A'}`);
      console.log(`Full response:`, JSON.stringify(data1, null, 2));
      return true;
    }

    if (data1.error) {
      console.log(`❌ Error: ${data1.error.message}`);

      // Format 2: With optimization parameters at root level
      console.log('\n📋 Format 2: With root-level parameters...');
      const format2 = {
        jsonrpc: '2.0',
        id: 2,
        method: 'optimizeTransaction',
        params: {
          transactions: [
            { params: [base64Tx] }
          ],
          cuPrice: 'median',
          jitoTip: 'low'
        }
      };

      const response2 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(format2)
      });

      const data2 = await response2.json();
      console.log('Response:', JSON.stringify(data2, null, 2));

      if (data2.result) {
        console.log('\n✅ ✅ ✅ SUCCESS with Format 2!');
        console.log(`Signature: ${data2.result.signature || 'N/A'}`);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    return false;
  }
}

// Run test
testDevnetGateway()
  .then(success => {
    console.log('\n' + '='.repeat(70));
    if (success) {
      console.log('🎉 DEVNET TEST PASSED - Gateway integration working!');
    } else {
      console.log('⚠️  DEVNET TEST INCOMPLETE - Need more investigation');
    }
    console.log('='.repeat(70) + '\n');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });

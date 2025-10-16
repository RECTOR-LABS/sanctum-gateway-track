import dotenv from 'dotenv';
import { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';

dotenv.config({ path: '.env' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/mainnet';
const MAINNET_RPC = 'https://api.mainnet-beta.solana.com';

async function testMainnetNoTip() {
  console.log('🧪 TESTING MAINNET - NO MANUAL TIP (Let Gateway Handle It)\n');
  console.log('='.repeat(70));

  try {
    const walletPath = '/Users/rz/local-dev/sanctum-gateway-track/mainnet-wallet.json';
    const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    const connection = new Connection(MAINNET_RPC, 'confirmed');

    console.log(`\n📂 Wallet: ${wallet.publicKey.toBase58()}`);

    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`💰 Balance: ${balance / LAMPORTS_PER_SOL} SOL`);

    // Create simple transaction - NO TIP INSTRUCTION
    console.log(`\n🏗️  Building simple transaction (NO manual tip)...`);
    const recipientKeypair = Keypair.generate();
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: wallet.publicKey,
      blockhash,
      lastValidBlockHeight,
    });

    // ONLY the transfer - no tip
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientKeypair.publicKey,
        lamports: 0.001 * LAMPORTS_PER_SOL,
      })
    );

    console.log(`✅ Transaction with 1 instruction:`);
    console.log(`   Transfer 0.001 SOL to ${recipientKeypair.publicKey.toBase58().substring(0, 20)}...`);
    console.log(`   (No manual tip - Gateway should handle it)`);

    // Sign
    transaction.sign(wallet);

    // Serialize
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

    console.log(`\n📥 Gateway Response:`);
    console.log(JSON.stringify(data, null, 2));

    if (data.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS!`);
      console.log(`Signature: ${data.result}`);
      console.log(`\nView: https://solscan.io/tx/${data.result}`);
      return { success: true, signature: data.result };
    } else if (data.error) {
      console.log(`\n❌ Error: ${data.error.message}`);
      return { success: false };
    }

    return { success: false };
  } catch (error) {
    console.error(`\n💥 Error:`, error);
    return { success: false };
  }
}

testMainnetNoTip()
  .then(result => {
    console.log('\n' + '='.repeat(70));
    console.log(result.success ? '🎉 SUCCESS!' : '⚠️  Failed');
    console.log('='.repeat(70));
    process.exit(result.success ? 0 : 1);
  });

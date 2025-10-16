import dotenv from 'dotenv';
import { Connection, Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import fs from 'fs';

dotenv.config({ path: '.env' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/mainnet';
const MAINNET_RPC = 'https://api.mainnet-beta.solana.com';

async function testBuildThenSend() {
  console.log('🧪 TESTING buildGatewayTransaction + sendTransaction\n');
  console.log('='.repeat(70));

  try {
    const walletPath = '/Users/rz/local-dev/sanctum-gateway-track/mainnet-wallet.json';
    const secretKey = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
    const wallet = Keypair.fromSecretKey(Uint8Array.from(secretKey));
    const connection = new Connection(MAINNET_RPC, 'confirmed');

    console.log(`\n📂 Wallet: ${wallet.publicKey.toBase58()}`);

    // Create unsigned transaction
    console.log(`\n🏗️  Building unsigned transaction...`);
    const recipientKeypair = Keypair.generate();
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      feePayer: wallet.publicKey,
      blockhash,
      lastValidBlockHeight,
    });

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: recipientKeypair.publicKey,
        lamports: 0.001 * LAMPORTS_PER_SOL,
      })
    );

    // Serialize UNSIGNED transaction
    const unsignedSerialized = transaction.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });
    const unsignedBase64 = unsignedSerialized.toString('base64');

    console.log(`✅ Unsigned transaction: ${unsignedSerialized.length} bytes`);

    // Step 1: buildGatewayTransaction
    console.log(`\n🔨 Step 1: Calling buildGatewayTransaction...`);

    const buildResponse = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'buildGatewayTransaction',
        params: [unsignedBase64]
      })
    });

    const buildData = await buildResponse.json();
    console.log(`\n📥 buildGatewayTransaction Response:`);
    console.log(JSON.stringify(buildData, null, 2));

    if (buildData.error) {
      console.log(`\n❌ buildGatewayTransaction failed`);
      return { success: false };
    }

    if (!buildData.result) {
      console.log(`\n⚠️  No result from buildGatewayTransaction`);
      return { success: false };
    }

    // Step 2: Deserialize, sign the built transaction
    console.log(`\n✍️  Step 2: Signing the built transaction...`);
    const builtTxBase64 = buildData.result.transaction;
    const builtTxBuffer = Buffer.from(builtTxBase64, 'base64');

    // Deserialize the transaction Gateway built for us
    const builtTx = Transaction.from(builtTxBuffer);

    // Sign it
    builtTx.sign(wallet);

    // Serialize the signed transaction
    const signedSerialized = builtTx.serialize({ requireAllSignatures: true });
    const signedBase64 = signedSerialized.toString('base64');

    console.log(`✅ Signed transaction: ${signedSerialized.length} bytes`);
    console.log(`   Transaction now has ${builtTx.instructions.length} instructions (Gateway added tip!)`);

    // Step 3: Send via sendTransaction
    console.log(`\n🚀 Step 3: Sending via sendTransaction...`);

    const sendResponse = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'sendTransaction',
        params: [signedBase64, { encoding: 'base64' }]
      })
    });

    const sendData = await sendResponse.json();
    console.log(`\n📥 sendTransaction Response:`);
    console.log(JSON.stringify(sendData, null, 2));

    if (sendData.result) {
      console.log(`\n✅ ✅ ✅ SUCCESS! Transaction sent!`);
      console.log(`\nSignature: ${sendData.result}`);
      console.log(`\nView: https://solscan.io/tx/${sendData.result}`);

      // Wait for confirmation
      console.log(`\n⏳ Waiting 10 seconds for confirmation...`);
      await new Promise(resolve => setTimeout(resolve, 10000));

      const status = await connection.getSignatureStatus(sendData.result);
      console.log(`\n📊 Status:`, JSON.stringify(status, null, 2));

      return { success: true, signature: sendData.result };
    } else if (sendData.error) {
      console.log(`\n❌ sendTransaction failed: ${sendData.error.message}`);
      return { success: false };
    }

    return { success: false };

  } catch (error) {
    console.error(`\n💥 Error:`, error);
    return { success: false };
  }
}

testBuildThenSend()
  .then(result => {
    console.log('\n' + '='.repeat(70));
    console.log(result.success ? '🎉 Progress!' : '⚠️  Failed');
    console.log('='.repeat(70));
    process.exit(result.success ? 0 : 1);
  });

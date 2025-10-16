import { Connection, clusterApiUrl } from '@solana/web3.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testGatewayConnection() {
  console.log('🔍 Testing Gateway Connection...\n');

  try {
    // Test Gateway RPC endpoint
    const gatewayUrl = process.env.GATEWAY_RPC_URL;
    if (!gatewayUrl) {
      throw new Error('GATEWAY_RPC_URL not found in environment variables');
    }

    console.log(`📡 Gateway URL: ${gatewayUrl.split('?')[0]}...`);
    console.log(`🔑 API Key: ${process.env.GATEWAY_API_KEY?.substring(0, 10)}...`);
    console.log('');

    // Create connection using Gateway
    const connection = new Connection(gatewayUrl, 'confirmed');

    // Test 1: Get version
    console.log('Test 1: Getting Solana version...');
    const version = await connection.getVersion();
    console.log(`✅ Solana Version: ${JSON.stringify(version)}\n`);

    // Test 2: Get recent blockhash
    console.log('Test 2: Getting recent blockhash...');
    const { blockhash } = await connection.getLatestBlockhash();
    console.log(`✅ Recent Blockhash: ${blockhash}\n`);

    // Test 3: Get slot
    console.log('Test 3: Getting current slot...');
    const slot = await connection.getSlot();
    console.log(`✅ Current Slot: ${slot}\n`);

    // Test 4: Get epoch info
    console.log('Test 4: Getting epoch info...');
    const epochInfo = await connection.getEpochInfo();
    console.log(`✅ Epoch: ${epochInfo.epoch}, Slot: ${epochInfo.absoluteSlot}\n`);

    console.log('✅ All tests passed! Gateway connection is working correctly.');
    console.log('🎉 You can now proceed with implementing Gateway transactions.\n');

    return true;
  } catch (error) {
    console.error('❌ Gateway connection test failed:');
    console.error(error);
    return false;
  }
}

// Run test
testGatewayConnection()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

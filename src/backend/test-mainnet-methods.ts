import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/mainnet';

async function testMainnetMethods() {
  console.log('🔍 Testing Gateway MAINNET Methods\n');
  console.log('='.repeat(70));

  //Test 1: getSlot (standard Solana RPC)
  console.log('\n🧪 Test 1: getSlot on MAINNET...');
  try {
    const response1 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSlot',
        params: []
      })
    });

    const data1 = await response1.json();
    console.log('Response:', JSON.stringify(data1, null, 2));

    if (data1.result) {
      console.log(`✅ getSlot works on mainnet! Current slot: ${data1.result}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 2: getTipAccounts
  console.log('\n🧪 Test 2: getTipAccounts on MAINNET...');
  try {
    const response2 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'getTipAccounts',
        params: []
      })
    });

    const data2 = await response2.json();
    console.log('Response:', JSON.stringify(data2, null, 2));

    if (data2.result) {
      console.log(`✅ getTipAccounts works! Found ${data2.result.length} tip accounts`);
    }
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 3: getHealth
  console.log('\n🧪 Test 3: getHealth on MAINNET...');
  try {
    const response3 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'getHealth',
        params: []
      })
    });

    const data3 = await response3.json();
    console.log('Response:', JSON.stringify(data3, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 4: getLatestBlockhash
  console.log('\n🧪 Test 4: getLatestBlockhash on MAINNET...');
  try {
    const response4 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 4,
        method: 'getLatestBlockhash',
        params: []
      })
    });

    const data4 = await response4.json();
    console.log('Response:', JSON.stringify(data4, null, 2));

    if (data4.result) {
      console.log(`✅ getLatestBlockhash works!`);
    }
  } catch (error) {
    console.error('Error:', error);
  }

  console.log('\n' + '='.repeat(70));
  console.log('\n💡 CONCLUSION:');
  console.log('If mainnet methods work but devnet methods don\'t,');
  console.log('this suggests Gateway devnet may not be fully functional.');
  console.log('We may need to test on mainnet with real SOL.');
  console.log('='.repeat(70));
}

testMainnetMethods()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
  });

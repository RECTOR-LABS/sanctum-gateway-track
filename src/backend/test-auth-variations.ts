import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/mainnet';

async function testAuthVariations() {
  console.log('🔐 Testing Different Authentication Methods\n');
  console.log('='.repeat(70));

  // Test 1: API Key in header (Authorization Bearer)
  console.log('\n🧪 Test 1: API Key in Authorization header...');
  try {
    const response1 = await fetch(GATEWAY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_API_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSlot',
        params: []
      })
    });

    const data1 = await response1.json();
    console.log('Response:', JSON.stringify(data1, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 2: API Key in X-API-Key header
  console.log('\n🧪 Test 2: API Key in X-API-Key header...');
  try {
    const response2 = await fetch(GATEWAY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': GATEWAY_API_KEY
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'getSlot',
        params: []
      })
    });

    const data2 = await response2.json();
    console.log('Response:', JSON.stringify(data2, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 3: API Key in custom Gateway header
  console.log('\n🧪 Test 3: API Key in X-Gateway-Key header...');
  try {
    const response3 = await fetch(GATEWAY_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Gateway-Key': GATEWAY_API_KEY
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'getSlot',
        params: []
      })
    });

    const data3 = await response3.json();
    console.log('Response:', JSON.stringify(data3, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 4: Original method (query param) as baseline
  console.log('\n🧪 Test 4: API Key in query param (original)...');
  try {
    const response4 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 4,
        method: 'getSlot',
        params: []
      })
    });

    const data4 = await response4.json();
    console.log('Response:', JSON.stringify(data4, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 5: Try the Gateway RPC URL directly (with embedded API key)
  console.log('\n🧪 Test 5: Using GATEWAY_RPC_URL directly...');
  try {
    const rpcUrl = process.env.GATEWAY_RPC_URL!;
    const response5 = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 5,
        method: 'getSlot',
        params: []
      })
    });

    const data5 = await response5.json();
    console.log('Response:', JSON.stringify(data5, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }

  console.log('\n' + '='.repeat(70));
}

testAuthVariations()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
  });

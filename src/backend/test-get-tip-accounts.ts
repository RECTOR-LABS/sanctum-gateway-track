import dotenv from 'dotenv';

dotenv.config({ path: '.env.devnet' });

const GATEWAY_API_KEY = process.env.GATEWAY_API_KEY!;
const GATEWAY_BASE_URL = 'https://tpg.sanctum.so/v1/devnet';

async function testGetTipAccounts() {
  console.log('🔍 Testing Gateway RPC Methods\n');
  console.log('='.repeat(70));

  // Test 1: getTipAccounts (Jito method)
  console.log('\n🧪 Test 1: getTipAccounts...');
  try {
    const response1 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTipAccounts',
        params: []
      })
    });

    const data1 = await response1.json();
    console.log('Response:', JSON.stringify(data1, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 2: getHealth
  console.log('\n🧪 Test 2: getHealth...');
  try {
    const response2 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'getHealth',
        params: []
      })
    });

    const data2 = await response2.json();
    console.log('Response:', JSON.stringify(data2, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 3: List available methods (non-standard but sometimes works)
  console.log('\n🧪 Test 3: rpc.discover (list methods)...');
  try {
    const response3 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 3,
        method: 'rpc.discover',
        params: []
      })
    });

    const data3 = await response3.json();
    console.log('Response:', JSON.stringify(data3, null, 2));
  } catch (error) {
    console.error('Error:', error);
  }

  // Test 4: getSlot (standard Solana RPC)
  console.log('\n🧪 Test 4: getSlot (standard Solana RPC)...');
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

  // Test 5: Try Gateway-specific method names
  console.log('\n🧪 Test 5: gateway.getConfig...');
  try {
    const response5 = await fetch(`${GATEWAY_BASE_URL}?apiKey=${GATEWAY_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 5,
        method: 'gateway.getConfig',
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

testGetTipAccounts()
  .then(() => {
    console.log('✅ Discovery tests complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Error:', error);
    process.exit(1);
  });

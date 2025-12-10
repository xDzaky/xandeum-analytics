/**
 * Test Netlify Function Locally
 * Run: node test-netlify-function.js
 */

async function testNetlifyFunction() {
  console.log('🧪 Testing Netlify Function Logic...\n');

  const endpoints = [
    'http://192.190.136.36:6000/rpc',
    'http://192.190.136.37:6000/rpc',
    'http://192.190.136.38:6000/rpc',
    'http://161.97.97.41:6000/rpc',
  ];

  const testBody = {
    jsonrpc: '2.0',
    method: 'get-pods-with-stats',
    id: 1,
  };

  for (const endpoint of endpoints) {
    try {
      console.log(`🔄 Testing: ${endpoint}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`   Status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        console.log(`   ❌ Failed\n`);
        continue;
      }

      const data = await response.json();
      
      if (data.result) {
        console.log(`   ✅ SUCCESS!`);
        console.log(`   Total nodes: ${data.result.total_count}`);
        console.log(`   Sample node:`, data.result.pods[0]);
        console.log('\n✅ Found working endpoint:', endpoint);
        return;
      } else if (data.error) {
        console.log(`   ⚠️ API Error:`, data.error.message);
      }
    } catch (error) {
      console.log(`   ❌ ${error.message}\n`);
      continue;
    }
  }

  console.log('\n💥 All endpoints failed!');
}

testNetlifyFunction();

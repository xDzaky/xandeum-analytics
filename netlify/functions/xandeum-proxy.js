/**
 * Netlify Function - Xandeum API Proxy
 * Netlify ALLOWS HTTP requests from functions!
 * Uses native fetch (Node 18+)
 */

export const handler = async (event) => {
  console.log('📡 Netlify function called:', event.httpMethod);
  
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Only POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request
    const body = JSON.parse(event.body);
    console.log('📨 Request method:', body.method);

    // Xandeum endpoints
    const endpoints = [
      'http://192.190.136.36:6000/rpc',
      'http://192.190.136.37:6000/rpc',
      'http://192.190.136.38:6000/rpc',
      'http://161.97.97.41:6000/rpc',
      'http://173.212.203.145:6000/rpc',
      'http://192.190.136.28:6000/rpc',
      'http://192.190.136.29:6000/rpc',
      'http://173.212.220.65:6000/rpc',
      'http://207.244.255.1:6000/rpc',
    ];

    // Try endpoints with timeout using AbortController
    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Trying: ${endpoint}`);
        
        // AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          console.log(`⚠️ ${endpoint} returned ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        if (data.result || data.error) {
          console.log(`✅ Success from ${endpoint}`);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data),
          };
        }
      } catch (error) {
        console.error(`❌ ${endpoint} failed:`, error.message);
        continue;
      }
    }

    // All failed
    console.error('💥 All endpoints failed');
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32603, message: 'All endpoints failed' },
        id: body.id || null,
      }),
    };
  } catch (error) {
    console.error('💥 Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        error: { code: -32603, message: error.message },
        id: null,
      }),
    };
  }
};

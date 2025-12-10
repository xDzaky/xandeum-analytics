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
    const errors = [];
    for (const endpoint of endpoints) {
      try {
        console.log(`🔄 Trying: ${endpoint}`);
        
        // AbortController for timeout (5s for faster failover)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const startTime = Date.now();
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        const duration = Date.now() - startTime;

        clearTimeout(timeoutId);

        console.log(`   Response: ${response.status} in ${duration}ms`);

        if (!response.ok) {
          errors.push(`${endpoint}: HTTP ${response.status}`);
          continue;
        }

        const data = await response.json();
        
        if (data.result || data.error) {
          console.log(`✅ Success from ${endpoint} in ${duration}ms`);
          console.log(`   Total count: ${data.result?.total_count || 'N/A'}`);
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data),
          };
        } else {
          errors.push(`${endpoint}: No result/error in response`);
        }
      } catch (error) {
        const errMsg = error.name === 'AbortError' ? 'Timeout (5s)' : error.message;
        console.error(`❌ ${endpoint}: ${errMsg}`);
        errors.push(`${endpoint}: ${errMsg}`);
        continue;
      }
    }

    // All failed - log detailed errors
    console.error('💥 All endpoints failed. Errors:', errors);
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({
        jsonrpc: '2.0',
        error: { 
          code: -32603, 
          message: 'All endpoints failed',
          details: errors.slice(0, 3), // Include first 3 errors for debugging
        },
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

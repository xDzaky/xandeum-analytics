/**
 * Vercel Serverless Function - Xandeum API Proxy
 * Bypasses CORS and mixed content (HTTPS→HTTP) restrictions
 */

// Increase timeout for Vercel function
export const config = {
  maxDuration: 30, // 30 seconds max (Vercel Pro allows up to 60s)
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      jsonrpc: '2.0',
      error: { code: -32600, message: 'Method not allowed' },
      id: null 
    });
  }

  // Xandeum pRPC endpoints (from Discord) - reordered by reliability
  const endpoints = [
    'http://192.190.136.36:6000/rpc', // Primary (verified working)
    'http://192.190.136.37:6000/rpc',
    'http://192.190.136.38:6000/rpc',
    'http://161.97.97.41:6000/rpc',
    'http://173.212.203.145:6000/rpc',
    'http://192.190.136.28:6000/rpc',
    'http://192.190.136.29:6000/rpc',
    'http://173.212.220.65:6000/rpc',
    'http://207.244.255.1:6000/rpc',
  ];

  // Try each endpoint until one succeeds
  let lastError = null;
  let successfulEndpoint = null;
  
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    try {
      console.log(`🔄 [${i + 1}/${endpoints.length}] Trying: ${endpoint}`);
      
      // Shorter timeout per endpoint to try more endpoints
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': 'XandeumAnalytics/1.0'
        },
        body: JSON.stringify(req.body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Validate JSON-RPC response
      if (!data.result && !data.error) {
        throw new Error('Invalid JSON-RPC response');
      }
      
      successfulEndpoint = endpoint;
      console.log(`✅ Success with endpoint: ${endpoint}`);
      
      // Success! Return data
      return res.status(200).json(data);
      
    } catch (error) {
      lastError = error;
      console.error(`❌ ${endpoint} failed:`, error.message);
      // Try next endpoint
      continue;
    }
  }

  // All endpoints failed
  console.error(`❌ ALL ENDPOINTS FAILED. Last error: ${lastError?.message}`);
  console.error(`Tried ${endpoints.length} endpoints`);
  
  return res.status(503).json({
    jsonrpc: '2.0',
    error: {
      code: -32603,
      message: `All ${endpoints.length} endpoints failed. Last error: ${lastError?.message || 'Unknown'}`,
      data: {
        endpoints: endpoints,
        lastError: lastError?.message,
      }
    },
    id: req.body?.id || null,
  });
}

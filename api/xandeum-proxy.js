/**
 * Vercel Serverless Function - Xandeum API Proxy
 * Bypasses CORS and mixed content (HTTPS→HTTP) restrictions
 */

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

  // Xandeum pRPC endpoints (from Discord)
  const endpoints = [
    'http://192.190.136.36:6000/rpc',
    'http://192.190.136.37:6000/rpc',
    'http://192.190.136.38:6000/rpc',
    'http://192.190.136.28:6000/rpc',
    'http://192.190.136.29:6000/rpc',
    'http://161.97.97.41:6000/rpc',
    'http://173.212.203.145:6000/rpc',
    'http://173.212.220.65:6000/rpc',
    'http://207.244.255.1:6000/rpc',
  ];

  // Try each endpoint until one succeeds
  let lastError = null;
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      
      // Success! Return data
      return res.status(200).json(data);
      
    } catch (error) {
      lastError = error;
      console.log(`❌ ${endpoint} failed:`, error.message);
      // Try next endpoint
      continue;
    }
  }

  // All endpoints failed
  return res.status(503).json({
    jsonrpc: '2.0',
    error: {
      code: -32603,
      message: `All endpoints failed. Last error: ${lastError?.message || 'Unknown'}`,
    },
    id: req.body?.id || null,
  });
}

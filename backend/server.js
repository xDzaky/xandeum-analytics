import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Xandeum pRPC endpoints (prioritized based on testing)
const XANDEUM_ENDPOINTS = [
  'http://192.190.136.36:6000/rpc', // PRIMARY - Fastest & most stable
  'http://192.190.136.28:6000/rpc',
  'http://192.190.136.29:6000/rpc',
  'http://161.97.97.41:6000/rpc',
  'http://207.244.255.1:6000/rpc',
  'http://192.190.136.37:6000/rpc',
  'http://192.190.136.38:6000/rpc',
  'http://173.212.203.145:6000/rpc',
  'http://173.212.220.65:6000/rpc',
];

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    endpoints: XANDEUM_ENDPOINTS.length,
  });
});

// Main proxy endpoint
app.post('/api/rpc', async (req, res) => {
  const requestBody = req.body;
  
  console.log('📡 Received RPC request:', {
    method: requestBody.method,
    timestamp: new Date().toISOString(),
  });

  // Validate JSON-RPC request
  if (!requestBody.jsonrpc || !requestBody.method) {
    return res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32600,
        message: 'Invalid Request - missing jsonrpc or method',
      },
      id: requestBody.id || null,
    });
  }

  const errors = [];
  
  // If get-pods-with-stats fails, try fallback to get-pods for v0.6.0 compatibility
  const methodsToTry = requestBody.method === 'get-pods-with-stats'
    ? ['get-pods-with-stats', 'get-pods']
    : [requestBody.method];

  // Try each method with all endpoints
  for (const method of methodsToTry) {
    console.log(`🔍 Trying method: ${method}`);
    const body = { ...requestBody, method };

    for (const endpoint of XANDEUM_ENDPOINTS) {
      try {
        console.log(`🔄 Attempting: ${endpoint}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log(`⏰ Timeout for ${endpoint}`);
          controller.abort();
        }, 10000); // 10 second timeout

        const startTime = Date.now();
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Xandeum-Analytics-Backend/1.0',
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        });

        const duration = Date.now() - startTime;
        clearTimeout(timeoutId);

        console.log(`✅ Response: ${response.status} in ${duration}ms`);

        if (!response.ok) {
          const errorText = await response.text().catch(() => 'No body');
          console.error(`❌ HTTP ${response.status}: ${errorText.substring(0, 100)}`);
          errors.push(`${endpoint}: HTTP ${response.status}`);
          continue;
        }

        const data = await response.json();

        // Validate response
        if (data.result || data.error) {
          console.log(`🎯 SUCCESS from ${endpoint} with ${method} in ${duration}ms`);
          
          if (data.result?.total_count) {
            console.log(`📊 Total nodes: ${data.result.total_count}`);
          }

          // Return successful response
          return res.json(data);
        } else {
          console.warn(`⚠️ No result/error in response from ${endpoint}`);
          errors.push(`${endpoint}: Invalid response structure`);
        }
      } catch (error) {
        const errMsg = error.name === 'AbortError' 
          ? 'Timeout (10s)' 
          : error.message;
        
        console.error(`❌ ${endpoint} FAILED: ${errMsg}`);
        errors.push(`${endpoint} (${method}): ${errMsg}`);
        continue;
      }
    }
  }

  // All endpoints failed
  console.error('💥 All endpoints failed:', errors);
  
  return res.status(503).json({
    jsonrpc: '2.0',
    error: {
      code: -32603,
      message: 'All endpoints failed',
      details: errors.slice(0, 5), // Return first 5 errors
    },
    id: requestBody.id || null,
  });
});

// Endpoint info
app.get('/api/endpoints', (req, res) => {
  res.json({
    primary: XANDEUM_ENDPOINTS[0],
    fallbacks: XANDEUM_ENDPOINTS.slice(1),
    total: XANDEUM_ENDPOINTS.length,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Available endpoints: POST /api/rpc, GET /health, GET /api/endpoints',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message,
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🚀 Xandeum Analytics Backend Server');
  console.log(`📡 Listening on port ${PORT}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 RPC endpoint: http://localhost:${PORT}/api/rpc`);
  console.log(`🔗 Endpoints info: http://localhost:${PORT}/api/endpoints`);
  console.log(`\n✅ Server ready to proxy requests to Xandeum network`);
});

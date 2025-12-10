#!/bin/bash

echo "🧪 Testing Netlify Deployed Function..."
echo ""

# Test Netlify function endpoint
echo "📡 Calling Netlify function at: https://xandeum-analytics.netlify.app/.netlify/functions/xandeum-proxy"
echo ""

response=$(curl -s -w "\n%{http_code}" -X POST \
  "https://xandeum-analytics.netlify.app/.netlify/functions/xandeum-proxy" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "get-pods-with-stats",
    "id": 1
  }' 2>&1)

# Extract HTTP code (last line)
http_code=$(echo "$response" | tail -n1)
# Extract body (all except last line)
body=$(echo "$response" | head -n-1)

echo "HTTP Status: $http_code"
echo ""

if [ "$http_code" = "200" ]; then
  echo "✅ SUCCESS! Function is working!"
  echo ""
  echo "Response:"
  echo "$body" | jq '.' 2>/dev/null || echo "$body"
  
  # Extract total count if available
  total_count=$(echo "$body" | jq -r '.result.total_count' 2>/dev/null)
  if [ "$total_count" != "null" ] && [ -n "$total_count" ]; then
    echo ""
    echo "📊 Total pNodes: $total_count"
  fi
elif [ "$http_code" = "503" ]; then
  echo "❌ HTTP 503 - All endpoints failed"
  echo ""
  echo "Possible causes:"
  echo "1. All Xandeum API endpoints are down"
  echo "2. Network issue from Netlify servers"
  echo "3. pNode version 0.7.0 bug (mentioned in Discord)"
  echo ""
  echo "Response:"
  echo "$body"
else
  echo "⚠️ Unexpected status code"
  echo ""
  echo "Response:"
  echo "$body"
fi

echo ""
echo "🔗 Website: https://xandeum-analytics.netlify.app/"
echo "🔗 Function logs: https://app.netlify.com/sites/xandeum-analytics/functions"

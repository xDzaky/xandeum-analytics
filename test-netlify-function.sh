#!/bin/bash
# Quick test script for Netlify function

echo "🧪 Testing Netlify Function..."
echo ""

URL="https://xandeum-analytics.netlify.app/.netlify/functions/xandeum-proxy"

echo "📡 Sending request to: $URL"
echo ""

response=$(curl -X POST "$URL" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"get-pods-with-stats","params":[],"id":1}' \
  -w "\n\nHTTP_CODE: %{http_code}\nTIME: %{time_total}s\n" \
  2>&1)

echo "$response"
echo ""

if echo "$response" | grep -q "total_count"; then
    total=$(echo "$response" | grep -o '"total_count":[0-9]*' | grep -o '[0-9]*')
    echo "✅ SUCCESS! Got $total nodes"
    exit 0
else
    echo "❌ FAILED - No data received"
    echo ""
    echo "Check Netlify function logs at:"
    echo "https://app.netlify.com/sites/xandeum-analytics/functions"
    exit 1
fi

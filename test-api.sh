#!/bin/bash

# Xandeum pRPC API Verification Script
# Tests all public endpoints and validates data structure

echo "🧪 Xandeum pRPC API Verification"
echo "================================="
echo ""

# Public endpoints from Discord
ENDPOINTS=(
  "192.190.136.36:6000"
  "192.190.136.37:6000"
  "192.190.136.38:6000"
  "192.190.136.28:6000"
  "192.190.136.29:6000"
  "161.97.97.41:6000"
  "173.212.203.145:6000"
  "173.212.220.65:6000"
  "207.244.255.1:6000"
)

# Test get-pods-with-stats method
test_endpoint() {
  local endpoint=$1
  echo -n "Testing $endpoint ... "
  
  start_time=$(date +%s%3N)
  
  response=$(curl -s -m 10 -X POST "http://$endpoint/rpc" \
    -H "Content-Type: application/json" \
    -d '{
      "jsonrpc": "2.0",
      "method": "get-pods-with-stats",
      "id": 1
    }' 2>&1)
  
  end_time=$(date +%s%3N)
  response_time=$((end_time - start_time))
  
  # Check if response is valid JSON
  if echo "$response" | jq -e '.result.total_count' > /dev/null 2>&1; then
    total_count=$(echo "$response" | jq -r '.result.total_count')
    echo "✅ OK (${response_time}ms) - $total_count nodes"
    return 0
  else
    echo "❌ FAILED (${response_time}ms)"
    return 1
  fi
}

# Test all endpoints
echo "📡 Testing Public Endpoints:"
echo ""

working_count=0
total_count=${#ENDPOINTS[@]}

for endpoint in "${ENDPOINTS[@]}"; do
  if test_endpoint "$endpoint"; then
    ((working_count++))
  fi
done

echo ""
echo "================================="
echo "📊 Results: $working_count/$total_count endpoints working"
echo ""

# Detailed test on first working endpoint
echo "🔍 Detailed Test (Primary Endpoint):"
echo ""

response=$(curl -s -X POST "http://192.190.136.36:6000/rpc" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "get-pods-with-stats",
    "id": 1
  }')

if echo "$response" | jq -e '.result' > /dev/null 2>&1; then
  echo "$response" | jq '{
    total_nodes: .result.total_count,
    sample_node: .result.pods[0],
    versions: [.result.pods[].version] | unique,
    public_nodes: [.result.pods[] | select(.is_public == true)] | length,
    avg_uptime: ([.result.pods[].uptime | select(. != null)] | add / length),
    total_storage_gb: ([.result.pods[].storage_committed | select(. != null)] | add / 1073741824)
  }'
else
  echo "❌ Failed to get detailed stats"
fi

echo ""
echo "✅ Verification Complete!"

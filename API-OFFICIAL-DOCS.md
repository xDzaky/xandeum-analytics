# 🔄 API UPDATE - Official Documentation Analysis

## 📚 Source
**Official Documentation:** https://docs.xandeum.network/api/pnode-rpc-prpc-reference  
**Updated:** 27 Nov 2025  
**Status:** CURRENT & OFFICIAL ✅

---

## ⚠️ PENTING: Ada Perbedaan Dengan Yang Sebelumnya Digunakan!

### Yang Sebelumnya (dari xandeum-api.md):
```
Method: get-pods-with-stats
Endpoint: http://192.190.136.37:6000/rpc
```

### Yang Benar (Dari Official Docs):
```
Metode yang tersedia:
1. get-version      ✅
2. get-stats        ✅
3. get-pods         ✅ (BUKAN get-pods-with-stats!)
```

---

## 🎯 Available Methods (OFFICIAL)

### Method #1: `get-version`
**Purpose:** Returns the current version of the pnode software

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "get-version",
  "id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "version": "1.0.0"
  },
  "id": 1
}
```

---

### Method #2: `get-stats`
**Purpose:** Returns comprehensive statistics about the pnode

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "get-stats",
  "id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "metadata": {
      "total_bytes": 1048576000,
      "total_pages": 1000,
      "last_updated": 1672531200
    },
    "stats": {
      "cpu_percent": 15.5,
      "ram_used": 536870912,
      "ram_total": 8589934592,
      "uptime": 86400,
      "packets_received": 1250,
      "packets_sent": 980,
      "active_streams": 5
    },
    "file_size": 1048576000
  },
  "id": 1
}
```

**Fields:**
- `metadata.total_bytes` - Total bytes processed
- `stats.cpu_percent` - CPU usage percentage
- `stats.ram_used` / `ram_total` - Memory usage
- `stats.uptime` - Node uptime in seconds
- `stats.packets_received/sent` - Network packets
- `stats.active_streams` - Current active streams

---

### Method #3: `get-pods` ⭐
**Purpose:** Returns a list of all known peer pnodes in the network

**Request:**
```json
{
  "jsonrpc": "2.0",
  "method": "get-pods",
  "id": 1
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "result": {
    "pods": [
      {
        "address": "192.168.1.100:9001",
        "version": "1.0.0",
        "last_seen": "2023-12-01 14:30:00 UTC",
        "last_seen_timestamp": 1672574200
      },
      {
        "address": "10.0.0.5:9001",
        "version": "1.0.1",
        "last_seen": "2023-12-01 14:25:00 UTC",
        "last_seen_timestamp": 1672573900
      }
    ],
    "total_count": 2
  },
  "id": 1
}
```

**Fields:**
- `pods[].address` - Pod address and port (gossip port 9001)
- `pods[].version` - pNode version
- `pods[].last_seen` - Last seen timestamp (formatted)
- `pods[].last_seen_timestamp` - Unix timestamp
- `total_count` - Total number of known pods

---

## 🌐 Endpoint Configuration

### Base URL Format:
```
http://<pnode-ip>:6000/rpc
```

### Default (Private):
```
http://127.0.0.1:6000/rpc
```

### Public Access:
When configured with `--rpc-ip 0.0.0.0`, can be accessed from any network interface:
```
http://<external-ip>:6000/rpc
```

### Example Public Endpoint:
```
http://192.190.136.37:6000/rpc  (if this pNode has public RPC enabled)
```

---

## 🔧 HTTP Request Details

**Protocol:** JSON-RPC 2.0  
**Method:** POST  
**Endpoint Path:** `/rpc`  
**Content-Type:** `application/json`

**cURL Example:**
```bash
curl -X POST http://127.0.0.1:6000/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "get-pods",
    "id": 1
  }'
```

---

## 📊 Network Architecture

The pNode uses several network ports:

| Port | Service | Purpose |
|------|---------|---------|
| **6000** | pRPC API | JSON-RPC 2.0 API calls |
| **80** | Statistics | Dashboard (localhost only) |
| **9001** | Gossip | Peer discovery & communication |
| **5000** | Atlas | Data streaming |

---

## ⚠️ Error Handling

### Method Not Found (Wrong Method Name)
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32601,
    "message": "Method not found"
  },
  "id": 1
}
```

### Internal Error
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32603,
    "message": "Internal error"
  },
  "id": 1
}
```

### Standard Error Codes:
- `-32601` - Method not found
- `-32603` - Internal error

---

## 🚀 Integration Examples

### JavaScript/Node.js
```javascript
const fetch = require('node-fetch');

async function callPRPC(method, params = null) {
  const payload = {
    jsonrpc: "2.0",
    method: method,
    id: 1
  };
  
  if (params) payload.params = params;
  
  const response = await fetch('http://127.0.0.1:6000/rpc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  return await response.json();
}

// Usage
(async () => {
  const version = await callPRPC('get-version');
  console.log(`pNode version: ${version.result.version}`);
  
  const stats = await callPRPC('get-stats');
  console.log(`Uptime: ${stats.result.stats.uptime} seconds`);
  
  const pods = await callPRPC('get-pods');
  console.log(`Total pods: ${pods.result.total_count}`);
})();
```

### Python
```python
import requests
import json

def call_prpc(method, params=None):
  payload = {
    "jsonrpc": "2.0",
    "method": method,
    "id": 1
  }
  
  if params:
    payload["params"] = params
  
  response = requests.post(
    "http://127.0.0.1:6000/rpc",
    json=payload,
    headers={"Content-Type": "application/json"}
  )
  
  return response.json()

# Usage
version = call_prpc("get-version")
print(f"pNode version: {version['result']['version']}")

stats = call_prpc("get-stats")
print(f"CPU usage: {stats['result']['stats']['cpu_percent']}%")

pods = call_prpc("get-pods")
print(f"Total pods: {pods['result']['total_count']}")
```

### Bash/cURL
```bash
#!/bin/bash
PRPC_URL="http://127.0.0.1:6000/rpc"

# Function to call pRPC
call_prpc() {
  local method=$1
  curl -s -X POST "$PRPC_URL" \
    -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"method\":\"$method\",\"id\":1}"
}

# Get version
echo "Getting version..."
call_prpc "get-version" | jq '.result.version'

# Get stats
echo "Getting stats..."
call_prpc "get-stats" | jq '.result.stats.cpu_percent'

# Get pods
echo "Getting pods..."
call_prpc "get-pods" | jq '.result.total_count'
```

---

## ⚙️ Configuration

### Running a Public pNode
To make your pNode's RPC API publicly accessible:

```bash
# Start pNode with public RPC binding
pnode --rpc-ip 0.0.0.0 --rpc-port 6000
```

### Security Considerations
⚠️ When using `--rpc-ip 0.0.0.0`, your pRPC API will be accessible from any network interface.  
Ensure proper **firewall rules** are in place to protect unauthorized access.

---

## 📋 Rate Limiting
✅ **No rate limits** on the pRPC API currently implemented.  
⚠️ Be mindful of resource usage when making frequent requests.

---

## 🔍 Key Differences from Old Implementation

### Old (xandeum-api.md):
```javascript
Method: "get-pods-with-stats"
Response: {
  pods: [{...stats...}],
  total_count: number
}
```

### New (Official Docs):
```javascript
Method #1: "get-version"
Response: { version: "x.x.x" }

Method #2: "get-stats"  
Response: { metadata, stats }

Method #3: "get-pods"    // ← CORRECT METHOD
Response: {
  pods: [{
    address: "...",
    version: "...",
    last_seen: "...",
    last_seen_timestamp: number
  }],
  total_count: number
}
```

---

## ✅ Implementation Status

### Current Implementation in xandeumRPC.ts:
```typescript
// OLD (INCORRECT)
method: "get-pods-with-stats"  ❌

// NEW (CORRECT)
method: "get-pods"  ✅
// Plus separate "get-stats" call if needed
```

---

## 🚀 Next Steps

### Option 1: Update to Use Official Methods (RECOMMENDED)
- Use `get-pods` to get list of pNodes
- Use `get-stats` for node statistics
- Combine data as needed in frontend

### Option 2: Keep Current Implementation
- If the old `get-pods-with-stats` is still available on your endpoint
- But this is not in official documentation
- May not work on all public pNodes

---

## 📞 Quick Reference

| Need | Method | Endpoint |
|------|--------|----------|
| **pNode Version** | `get-version` | `/rpc` |
| **Node Stats** | `get-stats` | `/rpc` |
| **List of Pods** | `get-pods` | `/rpc` |
| **Base URL** | Any method | `http://<ip>:6000/rpc` |

---

## 🎯 Recommendation

Based on official documentation dated 27 Nov 2025:
- ✅ Use `get-pods` to retrieve list of pNodes
- ✅ Use `get-stats` to get system statistics
- ❌ Do NOT use `get-pods-with-stats` (not in official docs)

The official documentation shows the CORRECT and SUPPORTED methods.

---

**Documentation Source:** https://docs.xandeum.network/api/pnode-rpc-prpc-reference  
**Last Updated:** 27 Nov 2025  
**Current Status:** OFFICIAL & RECOMMENDED ✅

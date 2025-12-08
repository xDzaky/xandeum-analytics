# Xandeum Analytics - API Integration Guide

## 📡 Real-time Data from Xandeum Gossip Network

Xandeum Analytics Platform connects directly to the **Xandeum pNode gossip network** using JSON-RPC 2.0 protocol. All data is fetched in real-time from active pNodes running version **v0.7.0+**.

---

## 🔌 API Configuration

### Default Endpoint
```bash
VITE_XANDEUM_RPC_URL=http://192.190.136.37:6000
```

This connects to a public pNode that participates in the Xandeum gossip network. You can change this to your own pNode for better reliability.

### Environment Variables
```bash
# .env.local
VITE_XANDEUM_RPC_URL=http://192.190.136.37:6000  # Your pNode RPC endpoint
VITE_USE_MOCK_DATA=false                         # Set to true to use mock data
VITE_REFRESH_INTERVAL=30000                      # Data refresh interval (ms)
```

---

## 📋 API Method: `get-pods-with-stats`

### Request Format
```bash
curl -X POST http://192.190.136.37:6000/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "get-pods-with-stats",
    "id": 1
  }'
```

### Response Structure
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": null,
  "result": {
    "total_count": 21,
    "pods": [
      {
        "address": "192.190.136.37:9001",
        "is_public": true,
        "last_seen_timestamp": 1765209387,
        "pubkey": "Aj6AqP7xvmBNuPF5v4zNB3SYxBe3yP6rsqK6KsaKVXKM",
        "rpc_port": 6000,
        "storage_committed": 183000000000,
        "storage_usage_percent": 0.000051712021857923493,
        "storage_used": 94633,
        "uptime": 1461,
        "version": "0.7.0-trynet.20251208141952.3b3bb24"
      }
    ]
  }
}
```

### Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| `address` | string | IP:Port of the pNode |
| `is_public` | boolean/null | Whether the node is publicly accessible |
| `last_seen_timestamp` | number | Unix timestamp of last gossip message |
| `pubkey` | string/null | Public key of the pNode |
| `rpc_port` | number/null | RPC port number |
| `storage_committed` | number/null | Total committed storage (bytes) |
| `storage_usage_percent` | number/null | Percentage of storage used (0-1) |
| `storage_used` | number/null | Actual storage used (bytes) |
| `uptime` | number/null | Node uptime in seconds |
| `version` | string | pNode version string |

---

## 🔄 Data Flow

### 1. Initial Fetch
When the app loads, it calls `get-pods-with-stats` to get all active pNodes in the network.

### 2. Auto-Refresh (Every 30s)
The app automatically refetches data every 30 seconds to stay synchronized with the gossip network.

### 3. Historical Data Collection
Every time new data is fetched, it's stored locally for time-series visualization in the Network Health Timeline chart.

### 4. Data Transformation
Raw pNode data is transformed into the app's internal format:
```typescript
{
  id: "Aj6AqP7xvmBNuPF5v4zNB3SYxBe3yP6rsqK6KsaKVXKM",
  publicKey: "Aj6AqP7xvmBNuPF5v4zNB3SYxBe3yP6rsqK6KsaKVXKM",
  ipAddress: "192.190.136.37",
  port: 9001,
  version: "0.7.0-trynet.20251208141952.3b3bb24",
  status: "active",
  uptime: 98.5, // percentage
  storageCapacity: 183000000000,
  storageUsed: 94633,
  // ... more fields
}
```

---

## 📊 Real-time Features

### ✅ Data Directly from Gossip Network
- **Total Nodes**: Count of all pNodes in `pods` array
- **Active Nodes**: Nodes with `last_seen_timestamp` within 2 minutes
- **Online Percentage**: `(activeNodes / totalNodes) * 100`
- **Average Uptime**: Mean of all node uptime values
- **Network Health Score**: Calculated from availability + version health

### ✅ Historical Data
Stored in browser's `localStorage`:
- Last 1000 snapshots (~8 hours at 30s intervals)
- Supports time periods: 1h, 6h, 24h, 7d
- Auto-generates mock data for periods without history

### ✅ Interactive Timeline
Click time period buttons to switch views:
- **1h**: 2-minute intervals (30 points)
- **6h**: 10-minute intervals (36 points)
- **24h**: 30-minute intervals (48 points)
- **7d**: 3-hour intervals (56 points)

---

## 🎯 Dashboard Data Sources

| Component | Data Source | Update Frequency |
|-----------|-------------|------------------|
| **Health Gauge** | `networkHealth` from API | 30 seconds |
| **Total Nodes** | `total_count` from API | 30 seconds |
| **Online Nodes** | Active nodes count | 30 seconds |
| **Network Health Timeline** | Historical snapshots | Real-time + history |
| **Global Distribution Map** | IP-based geolocation | 30 seconds |
| **Insights Panel** | Derived from stats | 30 seconds |
| **Node List Table** | `pods` array from API | 30 seconds |
| **Version Distribution** | `version` field aggregation | 30 seconds |

---

## 🛠️ Code Implementation

### Service Layer (`src/services/xandeumRPC.ts`)
```typescript
// Makes JSON-RPC call to pNode
const result = await fetch('http://192.190.136.37:6000/rpc', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'get-pods-with-stats',
    id: 1,
  }),
});
```

### React Query Hook (`src/hooks/useNodes.ts`)
```typescript
export function useNetworkStats() {
  return useQuery<NetworkStats, Error>({
    queryKey: ['network-stats'],
    queryFn: async () => {
      const stats = await xandeumAPI.getNetworkStats();
      
      // Save to historical data
      historicalDataService.addSnapshot(
        stats.networkHealth,
        stats.activeNodes,
        stats.totalNodes,
        stats.averageUptime
      );
      
      return stats;
    },
    staleTime: 30000,
    refetchInterval: 30000,
  });
}
```

### Historical Data Service (`src/services/historicalData.ts`)
```typescript
class HistoricalDataService {
  // Stores snapshots in memory and localStorage
  addSnapshot(health, activeNodes, totalNodes, averageUptime) {
    this.snapshots.push({
      timestamp: Date.now(),
      health,
      activeNodes,
      totalNodes,
      averageUptime,
    });
  }
  
  // Returns data for specific time period
  getSnapshots(periodHours: number) {
    const cutoffTime = Date.now() - (periodHours * 60 * 60 * 1000);
    return this.snapshots.filter(s => s.timestamp >= cutoffTime);
  }
}
```

---

## 🔧 Troubleshooting

### API Connection Issues
1. **Check pNode is running**: Ensure the pNode at the configured RPC URL is online
2. **CORS errors**: For local development, you may need to configure CORS on the pNode
3. **Fallback to mock data**: Set `VITE_USE_MOCK_DATA=true` in `.env.local`

### Network Health Timeline Not Updating
1. **Wait 30 seconds**: Data is collected every 30 seconds
2. **Check browser console**: Look for API errors
3. **Clear history**: `localStorage.removeItem('xandeum_health_history')`

### No Historical Data
- Historical data builds over time as the app runs
- For immediate data, the app generates mock historical patterns
- Real data will replace mock data after first API call

---

## 🚀 Production Deployment

### Recommended Setup
1. **Run your own pNode** with RPC enabled
2. **Configure environment variable** to point to your pNode
3. **Enable caching** for better performance
4. **Monitor API health** using the built-in health check

### Example Production Config
```bash
# .env.production
VITE_XANDEUM_RPC_URL=https://your-pnode.domain.com:6000
VITE_USE_MOCK_DATA=false
VITE_REFRESH_INTERVAL=30000
```

---

## 📝 API Version Compatibility

| pNode Version | Supported | Notes |
|---------------|-----------|-------|
| v0.7.0+ | ✅ Yes | Full support with `get-pods-with-stats` |
| v0.6.x | ⚠️ Partial | May work but missing some fields |
| < v0.6.0 | ❌ No | Incompatible API |

**Recommendation**: Use pNode v0.7.0 or later for best results.

---

## 🎉 Summary

✅ **Real-time data** from Xandeum gossip network  
✅ **Auto-refresh** every 30 seconds  
✅ **Historical tracking** with localStorage persistence  
✅ **Interactive timeline** with 1h/6h/24h/7d views  
✅ **Fallback to mock data** for offline development  
✅ **Production ready** with configurable endpoints  

All dashboard data is now **live and real-time** from the actual Xandeum pNode network! 🚀

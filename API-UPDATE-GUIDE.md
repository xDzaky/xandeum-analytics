# 🔧 API SERVICE UPDATE GUIDE

## ⚠️ Perubahan yang Diperlukan

Dari dokumentasi resmi, method yang benar adalah:
- **Bukan:** `get-pods-with-stats`
- **Seharusnya:** `get-pods` + `get-stats`

---

## 📝 Code Changes Required

### File: `src/services/xandeumRPC.ts`

#### BEFORE (Incorrect):
```typescript
async getAllNodes(): Promise<PNode[]> {
  const result = await this.makeRPCCall('get-pods-with-stats');
  // ...
}
```

#### AFTER (Correct):
```typescript
async getAllNodes(): Promise<PNode[]> {
  // Use official "get-pods" method instead
  const result = await this.makeRPCCall('get-pods');
  // ...
}

async getNodeStats(): Promise<any> {
  // Use official "get-stats" method for system stats
  const result = await this.makeRPCCall('get-stats');
  return result;
}
```

---

## 🔄 Response Format Changes

### OLD (get-pods-with-stats):
```json
{
  "pods": [
    {
      "address": "192.168.1.100:9001",
      "pubkey": "...",
      "version": "1.0.0",
      "uptime": 86400,
      "storage_used": 1000,
      // ... more fields
    }
  ],
  "total_count": 2
}
```

### NEW (get-pods):
```json
{
  "pods": [
    {
      "address": "192.168.1.100:9001",
      "version": "1.0.0",
      "last_seen": "2023-12-01 14:30:00 UTC",
      "last_seen_timestamp": 1672574200
    }
  ],
  "total_count": 2
}
```

**Note:** New format is simpler - only essential pod info.

### NEW (get-stats):
```json
{
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
}
```

---

## ✅ Recommended Implementation

### Strategy: Combine Both Methods
```typescript
class XandeumRPCService {
  
  /**
   * Get all pNodes using official "get-pods" method
   */
  async getAllNodes(): Promise<PNode[]> {
    const result = await this.makeRPCCall('get-pods');
    
    if (!result || !result.pods) {
      throw new Error('Invalid response from pRPC');
    }
    
    return this.transformPodsToNodes(result.pods);
  }
  
  /**
   * Get system statistics using official "get-stats" method
   */
  async getSystemStats(): Promise<SystemStats> {
    const result = await this.makeRPCCall('get-stats');
    
    return {
      cpuPercent: result.stats.cpu_percent,
      ramUsed: result.stats.ram_used,
      ramTotal: result.stats.ram_total,
      uptime: result.stats.uptime,
      // ... map other fields
    };
  }
  
  /**
   * Get version using official "get-version" method
   */
  async getVersion(): Promise<string> {
    const result = await this.makeRPCCall('get-version');
    return result.version;
  }
}
```

---

## 📊 Field Mapping Changes

### Pod Fields (get-pods):
```typescript
interface PodResponse {
  address: string;              // IP:Port
  version: string;              // Version
  last_seen: string;            // Formatted timestamp
  last_seen_timestamp: number;  // Unix timestamp
  
  // REMOVED in official API:
  // - pubkey
  // - is_public
  // - uptime
  // - storage_*
  // - rpc_port
}
```

### To Get Additional Info:
- **System uptime:** Use `get-stats` method
- **Pod-specific stats:** Not available in official API (yet)
- **Storage info:** Use `get-stats` for system storage

---

## 🎯 What This Means for Your App

### For Network Stats:
- ✅ Get total pod count from `get-pods` → `total_count`
- ✅ Get system uptime from `get-stats` → `stats.uptime`
- ✅ Get pod version from `get-pods` → `pods[].version`
- ✅ Get last seen from `get-pods` → `pods[].last_seen_timestamp`

### For Network Health:
- ❌ Can't calculate per-pod uptime (not in official API)
- ✅ Can use system uptime as proxy for network health
- ✅ Can count active pods (last_seen within timeframe)
- ✅ Can track version distribution

### For Dashboard Display:
- ✅ Total nodes: `get-pods` total_count
- ✅ Online nodes: Count pods with recent last_seen
- ✅ Network health: System uptime percentage
- ✅ Version distribution: Aggregate versions from get-pods
- ✅ System stats: Get from `get-stats`

---

## ⚡ Quick Implementation Checklist

```
[ ] Update getAllNodes() to use "get-pods"
[ ] Add getSystemStats() using "get-stats"
[ ] Update interface definitions for new response format
[ ] Update transformPodsToNodes() for new fields
[ ] Test with curl:
    curl -X POST http://127.0.0.1:6000/rpc \
      -H "Content-Type: application/json" \
      -d '{"jsonrpc":"2.0","method":"get-pods","id":1}'
[ ] Update documentation
[ ] Test with real pNode
```

---

## 💡 Current Status

Your app currently uses `get-pods-with-stats` which:
- ✅ May work on some pNodes
- ❌ Is not in official documentation
- ❌ May break when pNodes are updated
- ⚠️ Not guaranteed to be available

**Recommendation:** Update to use official methods (`get-pods` + `get-stats`)

---

## 📞 Support

For detailed implementation, check:
- `API-OFFICIAL-DOCS.md` - Official method reference
- `API-INTEGRATION.md` - How API is used in app
- https://docs.xandeum.network/api/pnode-rpc-prpc-reference - Official docs


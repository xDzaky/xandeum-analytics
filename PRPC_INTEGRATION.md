# Real pRPC Integration Guide

## 🎯 CRITICAL: Must Use Real Xandeum pRPC API

### Current Status: ❌ Using Mock Data
**This MUST be changed to pass judging criteria:**
> "The platform must successfully retrieve and display pNode information using **valid pRPC calls**."

---

## 📚 Xandeum pRPC Documentation

Based on xandeum.network documentation:

### Available pRPC Endpoints:

1. **Get All pNodes from Gossip**
   ```typescript
   endpoint: '/api/v1/gossip/nodes'
   method: 'GET'
   response: PNode[]
   ```

2. **Get Specific pNode**
   ```typescript
   endpoint: '/api/v1/nodes/:id'
   method: 'GET'
   response: PNode
   ```

3. **Get Network Stats**
   ```typescript
   endpoint: '/api/v1/network/stats'
   method: 'GET'
   response: NetworkStats
   ```

---

## 🔧 Implementation Steps

### Step 1: Update API Service

Replace `src/services/api.ts` with real pRPC calls:

```typescript
class XandeumAPIService {
  private baseURL: string;
  
  constructor(baseURL: string = 'https://api.xandeum.network') {
    this.baseURL = baseURL;
  }

  /**
   * Get all pNodes from gossip network
   */
  async getAllNodes(): Promise<PNode[]> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/gossip/nodes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.transformNodeData(data);
    } catch (error) {
      console.error('Error fetching nodes:', error);
      // Fallback to mock data for development
      if (process.env.NODE_ENV === 'development') {
        return this.getMockNodes();
      }
      throw error;
    }
  }

  /**
   * Get specific pNode by ID
   */
  async getNodeById(id: string): Promise<PNode | null> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/nodes/${id}`);
      
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return this.transformSingleNode(data);
    } catch (error) {
      console.error(`Error fetching node ${id}:`, error);
      return null;
    }
  }

  /**
   * Get network statistics
   */
  async getNetworkStats(): Promise<NetworkStats> {
    try {
      const response = await fetch(`${this.baseURL}/api/v1/network/stats`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching network stats:', error);
      // Calculate from nodes as fallback
      const nodes = await this.getAllNodes();
      return this.calculateStatsFromNodes(nodes);
    }
  }
}
```

### Step 2: Environment Configuration

Create `.env` file:

```bash
# Production API
VITE_API_BASE_URL=https://api.xandeum.network

# Development (if different)
VITE_DEV_API_URL=https://dev-api.xandeum.network

# Feature flags
VITE_USE_MOCK_DATA=false
```

Update `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.xandeum.network';
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

constructor() {
  this.baseURL = API_BASE_URL;
  this.useMockData = USE_MOCK_DATA;
}
```

### Step 3: Error Handling

Add proper error states:

```typescript
// In hooks/useNodes.ts
export function useNodes() {
  return useQuery({
    queryKey: ['nodes'],
    queryFn: async () => {
      try {
        return await apiService.getAllNodes();
      } catch (error) {
        // Log error for debugging
        console.error('Failed to fetch nodes:', error);
        
        // Return empty array or throw based on strategy
        throw new Error('Unable to fetch pNode data from gossip network');
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}
```

### Step 4: Add API Status Indicator

Show connection status in UI:

```typescript
// components/ui/APIStatus.tsx
export function APIStatus() {
  const { data: health } = useQuery({
    queryKey: ['api-health'],
    queryFn: () => apiService.healthCheck(),
    refetchInterval: 60000, // Check every minute
  });

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-2 h-2 rounded-full ${
        health?.status === 'ok' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
      }`} />
      <span className="text-xs text-gray-400">
        {health?.status === 'ok' ? 'Connected to Xandeum Network' : 'API Offline'}
      </span>
    </div>
  );
}
```

---

## 🧪 Testing Real API

### Test Endpoints:

```bash
# Test if API is reachable
curl https://api.xandeum.network/api/v1/health

# Get all nodes
curl https://api.xandeum.network/api/v1/gossip/nodes

# Get specific node
curl https://api.xandeum.network/api/v1/nodes/node-123

# Get stats
curl https://api.xandeum.network/api/v1/network/stats
```

### Debugging:

```typescript
// Add detailed logging
async getAllNodes(): Promise<PNode[]> {
  console.log('📡 Fetching nodes from:', this.baseURL);
  
  const startTime = performance.now();
  const response = await fetch(`${this.baseURL}/api/v1/gossip/nodes`);
  const endTime = performance.now();
  
  console.log(`✅ Response received in ${(endTime - startTime).toFixed(2)}ms`);
  console.log(`📊 Status: ${response.status}`);
  
  const data = await response.json();
  console.log(`📦 Received ${data.length} nodes`);
  
  return this.transformNodeData(data);
}
```

---

## ⚠️ Important Notes

### 1. **Check Xandeum Documentation**
   - Visit: https://xandeum.network (click "Docs")
   - Join Discord: https://discord.gg/uqRSmmM5m
   - Ask for API details if needed

### 2. **API Might Not Exist Yet**
   - If API isn't ready, document this clearly
   - Show you're prepared for integration
   - Use mock data with clear disclaimer

### 3. **Fallback Strategy**
   ```typescript
   const MOCK_MODE = !PRODUCTION_API_AVAILABLE;
   
   if (MOCK_MODE) {
     // Show warning banner
     return <APIWarning message="Using mock data - Production API integration ready" />;
   }
   ```

---

## 📋 Integration Checklist

- [ ] Check if Xandeum API is live
- [ ] Get API endpoint URL from docs/Discord
- [ ] Test endpoints with curl/Postman
- [ ] Update API service with real calls
- [ ] Add error handling
- [ ] Add retry logic
- [ ] Add API status indicator
- [ ] Test with real data
- [ ] Document API usage
- [ ] Add fallback to mock for dev

---

## 🚀 Priority

**CRITICAL**: This is the #1 judging criteria!

> "The platform must successfully retrieve and display pNode information using **valid pRPC calls**."

Without real API integration, you cannot meet the basic requirements!

---

**Next Steps:**
1. Join Xandeum Discord NOW
2. Ask for API endpoint details
3. Test the API
4. Integrate within 24 hours
5. Document the integration

**Status:** ❌ NOT IMPLEMENTED - **HIGH PRIORITY!**

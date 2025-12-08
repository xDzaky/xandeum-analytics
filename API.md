# API Documentation

## Overview

This document describes the expected Xandeum pRPC API endpoints that this platform integrates with.

**Base URL:** `https://api.xandeum.network` (adjust based on actual Xandeum docs)

## Authentication

Currently, no authentication is required for public endpoints.

## Endpoints

### Get All pNodes

Retrieve a list of all pNodes from gossip.

**Endpoint:** `GET /api/v1/gossip/nodes`

**Response:**
```json
[
  {
    "id": "node-1",
    "publicKey": "0x1234567890abcdef...",
    "ipAddress": "192.168.1.100",
    "port": 8000,
    "version": "1.0.0",
    "status": "active",
    "lastSeen": "2024-12-08T10:00:00Z",
    "firstSeen": "2024-12-01T10:00:00Z",
    "uptime": 99.9,
    "location": {
      "country": "USA",
      "city": "New York",
      "latitude": 40.7128,
      "longitude": -74.0060
    },
    "performance": {
      "latency": 50,
      "storageCapacity": 1000000000000,
      "storageUsed": 500000000000,
      "bandwidth": 1000000
    }
  }
]
```

### Get Specific pNode

Get detailed information about a specific pNode.

**Endpoint:** `GET /api/v1/nodes/:nodeId`

**Parameters:**
- `nodeId` (string) - The unique identifier of the node

**Response:**
```json
{
  "id": "node-1",
  "publicKey": "0x1234567890abcdef...",
  "ipAddress": "192.168.1.100",
  "port": 8000,
  "version": "1.0.0",
  "status": "active",
  "lastSeen": "2024-12-08T10:00:00Z",
  "firstSeen": "2024-12-01T10:00:00Z",
  "uptime": 99.9,
  "location": {
    "country": "USA",
    "city": "New York",
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "performance": {
    "latency": 50,
    "storageCapacity": 1000000000000,
    "storageUsed": 500000000000,
    "bandwidth": 1000000
  },
  "metadata": {
    "additional": "information"
  }
}
```

### Get Network Statistics

Get aggregated network statistics.

**Endpoint:** `GET /api/v1/network/stats`

**Response:**
```json
{
  "totalNodes": 100,
  "activeNodes": 95,
  "inactiveNodes": 5,
  "averageUptime": 99.5,
  "totalStorage": 100000000000000,
  "usedStorage": 50000000000000,
  "networkHealth": 95.5,
  "lastUpdated": "2024-12-08T10:00:00Z"
}
```

### Health Check

Check API health status.

**Endpoint:** `GET /api/v1/health`

**Response:**
```json
{
  "status": "ok"
}
```

**Possible Status Values:**
- `ok` - All systems operational
- `degraded` - Partial service
- `down` - Service unavailable

## Error Responses

All endpoints may return error responses:

**Format:**
```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "status": 400
  }
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error
- `503` - Service Unavailable

## Rate Limiting

To prevent abuse, the API may implement rate limiting:
- Max requests: TBD
- Time window: TBD

## Data Types

### Node Status
- `active` - Node is operational
- `inactive` - Node is offline
- `syncing` - Node is synchronizing

### PNode Object
```typescript
interface PNode {
  id: string;
  publicKey: string;
  ipAddress: string;
  port: number;
  version: string;
  status: 'active' | 'inactive' | 'syncing';
  lastSeen: Date;
  firstSeen: Date;
  uptime: number; // percentage 0-100
  location?: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  performance?: {
    latency: number; // ms
    storageCapacity: number; // bytes
    storageUsed: number; // bytes
    bandwidth: number; // bytes/s
  };
  metadata?: Record<string, any>;
}
```

## Usage Example

```javascript
// Fetch all nodes
const response = await fetch('https://api.xandeum.network/api/v1/gossip/nodes');
const nodes = await response.json();

// Fetch specific node
const nodeResponse = await fetch('https://api.xandeum.network/api/v1/nodes/node-1');
const node = await nodeResponse.json();

// Get network stats
const statsResponse = await fetch('https://api.xandeum.network/api/v1/network/stats');
const stats = await statsResponse.json();
```

## Notes

- All timestamps are in ISO 8601 format (UTC)
- Storage values are in bytes
- Latency values are in milliseconds
- Bandwidth values are in bytes per second
- Uptime is a percentage from 0-100

## Integration in This Platform

The platform uses these endpoints through the `XandeumAPIService` class in `src/services/api.ts`.

Currently, mock data is used for development. Update the base URL and endpoint paths according to the actual Xandeum API documentation.

## Support

For API-related questions:
- Check [xandeum.network](https://xandeum.network) documentation
- Join the [Xandeum Discord](https://discord.gg/uqRSmmM5m)

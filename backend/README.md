# Xandeum Analytics Backend

Backend proxy server untuk Xandeum pNode Analytics Platform.

## 🚀 Deploy ke Railway

### Method 1: Deploy via Railway CLI

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login ke Railway
railway login

# 3. Initialize project (dari folder backend)
cd backend
railway init

# 4. Deploy
railway up

# 5. Get public URL
railway domain
```

### Method 2: Deploy via Railway Dashboard

1. Buka https://railway.app/
2. Klik "New Project"
3. Pilih "Deploy from GitHub repo"
4. Select repository: `xDzaky/xandeum-analytics`
5. Set Root Directory: `backend`
6. Railway akan auto-detect Node.js dan deploy

### Environment Variables (Optional)

Railway akan automatically set `PORT` environment variable.

Tidak ada environment variable lain yang diperlukan!

---

## 📡 API Endpoints

Setelah deploy, Railway akan memberikan URL seperti:
```
https://xandeum-analytics-backend-production.up.railway.app
```

### Available Endpoints:

#### 1. Health Check
```bash
GET https://your-app.railway.app/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2025-12-11T18:00:00.000Z",
  "endpoints": 9
}
```

#### 2. RPC Proxy (Main Endpoint)
```bash
POST https://your-app.railway.app/api/rpc
Content-Type: application/json

{
  "jsonrpc": "2.0",
  "method": "get-pods-with-stats",
  "params": [],
  "id": 1
}
```

Response:
```json
{
  "jsonrpc": "2.0",
  "result": {
    "pods": [...],
    "total_count": 146
  },
  "id": 1
}
```

#### 3. Endpoints Info
```bash
GET https://your-app.railway.app/api/endpoints
```

Response:
```json
{
  "primary": "http://192.190.136.36:6000/rpc",
  "fallbacks": ["http://192.190.136.28:6000/rpc", ...],
  "total": 9
}
```

---

## 🧪 Test Locally

```bash
# Install dependencies
cd backend
npm install

# Run server
npm start

# Or with auto-reload
npm run dev
```

Test:
```bash
# Health check
curl http://localhost:3001/health

# RPC call
curl -X POST http://localhost:3001/api/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"get-pods-with-stats","params":[],"id":1}'
```

---

## 🔧 Update Frontend

Setelah backend di-deploy ke Railway, update frontend untuk menggunakan Railway URL:

### File: `src/services/xandeumRPC.ts`

```typescript
// Ganti BASE_URL dengan Railway URL
const RAILWAY_API_URL = 'https://your-app.railway.app/api/rpc';

// Di constructor:
constructor() {
  if (import.meta.env.PROD) {
    // Production: use Railway backend
    this.rpcUrl = RAILWAY_API_URL;
  } else {
    // Development: use Vite proxy
    this.rpcUrl = '/api/rpc';
  }
}
```

---

## 📊 Features

- ✅ **CORS enabled** - Frontend bisa akses dari domain manapun
- ✅ **Multiple endpoints** - 9 fallback endpoints untuk reliability
- ✅ **Timeout handling** - 10 detik per endpoint
- ✅ **Method fallback** - Auto-fallback dari get-pods-with-stats ke get-pods
- ✅ **Error logging** - Detailed logs untuk debugging
- ✅ **Health check** - Monitor server status
- ✅ **Railway optimized** - Auto-detect PORT dari environment

---

## 🐛 Troubleshooting

### Railway tidak bisa deploy?

Check `package.json`:
- ✅ `"type": "module"` untuk ES Module
- ✅ `"engines": { "node": ">=18.0.0" }`
- ✅ `"start"` script ada

### API masih 503?

Check Railway logs:
```bash
railway logs
```

Look for:
- ✅ "Server ready to proxy requests"
- ❌ "All endpoints failed"

### CORS error?

CORS sudah enabled di server. Pastikan frontend kirim request ke Railway URL yang benar.

---

## 💰 Railway Pricing

**Free Tier:**
- ✅ 500 hours/month
- ✅ $5 credit/month
- ✅ Unlimited projects
- ✅ Cukup untuk competition & demo!

**Upgrade hanya jika:**
- Traffic > 10k requests/hour
- Perlu custom domain
- Butuh 24/7 uptime guarantee

---

## 📝 Next Steps

1. ✅ Deploy backend ke Railway
2. ✅ Copy Railway URL
3. ✅ Update `src/services/xandeumRPC.ts` dengan Railway URL
4. ✅ Build frontend: `npm run build`
5. ✅ Deploy frontend ke Netlify/Vercel (sekarang bisa karena Railway = HTTPS!)
6. ✅ Test full stack
7. ✅ Submit ke competition! 🏆

---

**Backend Status:** ✅ Ready to deploy!

# Troubleshooting Guide - Xandeum Analytics

## 🔴 Common Errors and Solutions

### 1. CORS Error - "NetworkError when attempting to fetch resource"

**Error:**
```
TypeError: NetworkError when attempting to fetch resource.
RPC call failed for method "get-pods-with-stats"
```

**Penyebab:**
Browser memblokir request ke pNode API karena CORS (Cross-Origin Resource Sharing) policy. Ini terjadi ketika aplikasi di `localhost:5173` mencoba mengakses API di `192.190.136.37:6000`.

**Solusi:**

#### Option 1: Gunakan Vite Proxy (✅ Sudah Dikonfigurasi)
Development server sudah dikonfigurasi dengan proxy otomatis:
```bash
npm run dev  # Server akan otomatis proxy request ke /api
```

Proxy akan meneruskan request dari `/api/*` ke `http://192.190.136.37:6000/*`.

#### Option 2: Gunakan Mock Data untuk Development
Edit `.env.local`:
```bash
VITE_USE_MOCK_DATA=true  # Gunakan data dummy
```

Kemudian restart server:
```bash
npm run dev
```

#### Option 3: Deploy ke Production
Build production tidak akan ada masalah CORS karena menggunakan direct URL:
```bash
npm run build
npm run preview  # Test production build
```

---

### 2. API Connection Failed

**Error:**
```
Failed to fetch from real API, using mock data
```

**Penyebab:**
- pNode server tidak dapat diakses
- Firewall memblokir koneksi
- URL salah

**Solusi:**

#### 1. Test Koneksi API Secara Manual
```bash
# Test dengan curl
curl -X POST http://192.190.136.37:6000/rpc \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "get-pods-with-stats",
    "id": 1
  }'
```

Jika sukses, Anda akan melihat response JSON dengan data pods.

#### 2. Periksa Network/Firewall
- Pastikan port 6000 tidak diblokir firewall
- Test ping ke server: `ping 192.190.136.37`
- Pastikan pNode sedang running

#### 3. Gunakan pNode Lokal
Jika Anda punya pNode sendiri:
```bash
# Edit .env.local
VITE_XANDEUM_RPC_URL=http://localhost:6000
```

---

### 3. Data Tidak Update

**Gejala:**
Dashboard menampilkan data tetapi tidak berubah setelah 30 detik.

**Solusi:**

#### 1. Buka Console Browser
Tekan `F12` → Tab "Console", cari log:
```
🔧 XandeumRPC initialized
📡 Fetching nodes from pRPC
```

#### 2. Periksa Network Tab
- Buka tab "Network" di DevTools
- Filter "Fetch/XHR"
- Refresh halaman
- Lihat apakah ada request ke `/api/rpc` atau gagal

#### 3. Clear Cache & Reload
```bash
# Hard refresh browser
Ctrl + Shift + R (Linux/Windows)
Cmd + Shift + R (Mac)
```

---

### 4. Historical Timeline Tidak Ada Data

**Gejala:**
Network Health Timeline menampilkan chart kosong atau hanya mock data.

**Penyebab:**
Data historis dikumpulkan dari waktu ke waktu. Saat pertama kali buka, belum ada history.

**Solusi:**

#### 1. Tunggu 30-60 Detik
Data akan mulai terkumpul setelah beberapa fetch cycle.

#### 2. Periksa LocalStorage
Buka Console:
```javascript
// Lihat data historis
JSON.parse(localStorage.getItem('xandeum_health_history'))

// Atau hapus untuk reset
localStorage.removeItem('xandeum_health_history')
```

#### 3. Gunakan Mock Data Sementara
Mock data akan otomatis ditampilkan jika belum ada data real.

---

### 5. Build Errors

**Error:**
```
TypeScript error in ...
```

**Solusi:**

#### 1. Clean Install Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

#### 2. Check TypeScript
```bash
npm run type-check  # Jika ada script ini
# Atau
npx tsc --noEmit
```

#### 3. Clear Vite Cache
```bash
rm -rf .vite
npm run dev
```

---

## 🛠️ Development Tips

### Mode Development vs Production

**Development Mode:**
```bash
npm run dev
# - Uses Vite proxy for CORS
# - Hot reload enabled
# - Source maps included
# - Request to /api/rpc proxied to pNode
```

**Production Mode:**
```bash
npm run build
npm run preview
# - Direct API calls (no proxy)
# - Optimized bundle
# - No CORS issues if hosted on same domain
```

### Environment Variables Cheat Sheet

```bash
# .env.local

# Production pNode URL (used in build)
VITE_XANDEUM_RPC_URL=http://192.190.136.37:6000

# Force mock data (useful for offline dev)
VITE_USE_MOCK_DATA=false

# Auto-refresh interval (milliseconds)
VITE_REFRESH_INTERVAL=30000

# Enable dev mode features
VITE_DEV_MODE=true
```

### Debug Mode

Untuk melihat log detail, buka Console browser dan lihat:

```javascript
// ✅ Success logs
🔧 XandeumRPC initialized
📡 Fetching nodes from pRPC
✅ Successfully fetched X nodes

// ⚠️ Fallback logs
⚠️ Using mock data as fallback
Failed to fetch from real API, using mock data

// ❌ Error logs
RPC call failed for method "get-pods-with-stats"
TypeError: NetworkError...
```

---

## 🚀 Quick Fixes

### "Website tidak berjalan sama sekali"
```bash
# 1. Install dependencies
npm install

# 2. Check Node version (perlu v18+)
node --version

# 3. Start dev server
npm run dev

# 4. Buka browser: http://localhost:5173
```

### "Data masih mock padahal VITE_USE_MOCK_DATA=false"
```bash
# 1. Stop server (Ctrl+C)
# 2. Restart server
npm run dev

# 3. Hard refresh browser
Ctrl + Shift + R
```

### "CORS error masih muncul"
```bash
# 1. Cek vite.config.ts sudah ada proxy
cat vite.config.ts | grep proxy

# 2. Restart dev server
npm run dev

# 3. Atau gunakan mock data
echo "VITE_USE_MOCK_DATA=true" >> .env.local
npm run dev
```

---

## 📞 Support

Jika masalah masih berlanjut:

1. **Check GitHub Issues**: Lihat apakah ada yang mengalami masalah serupa
2. **Browser Console**: Screenshot error di Console dan Network tab
3. **System Info**: 
   - OS version
   - Node version: `node --version`
   - npm version: `npm --version`
   - Browser version

---

## ✅ Health Check Checklist

Sebelum deploy production, pastikan:

- [ ] `npm run build` berhasil tanpa error
- [ ] `npm run preview` menampilkan website dengan benar
- [ ] Console browser tidak ada error merah
- [ ] Network tab menunjukkan sukses request ke API
- [ ] Data di dashboard update setiap 30 detik
- [ ] Timeline chart menampilkan data saat klik 1h/6h/24h/7d
- [ ] LocalStorage menyimpan historical data
- [ ] Mock data fallback bekerja jika API gagal

---

**Last Updated:** December 9, 2024  
**Version:** 1.0.0

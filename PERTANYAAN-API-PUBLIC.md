# 📝 DRAFT PERTANYAAN: API Public untuk Analytics Dashboard

## Konteks Situasi:

Saya sedang mengerjakan **Xandeum pNode Analytics Dashboard** untuk bounty Superteam/Xandeum Labs. Berdasarkan diskusi di Discord channel `#apps-developers`, saya mendapat informasi bahwa:

1. **Public pRPC endpoints** masih tidak stabil
2. **Method `get-pods-with-stats`** baru tersedia di v0.7.0 
3. **v0.7.0 memiliki bug** yang sedang di-fix oleh dev team
4. Beberapa **public IP** yang disebutkan (192.190.136.37, 192.190.136.36, dll) tidak responsive atau return 0 nodes

---

## 🙋 PERTANYAAN UNTUK BRAD / XANDEUM TEAM:

### Versi Bahasa Inggris:

```
Hi @Brad|Xandeum I'm NOT DM'ing YOU,

I'm building the pNode Analytics Dashboard for the Superteam bounty and need clarification on the public API situation:

1. **Stable Public Endpoint:**
   - Are there any stable public pRPC endpoints currently available for the dashboard?
   - Which IPs from your list (192.190.136.37, 192.190.136.36, etc.) are guaranteed to work?
   - Or should I wait for the v0.7.0 bug fix before testing with real endpoints?

2. **Recommended Method:**
   - Should I use `get-pods-with-stats` (v0.7.0+) or stick with `get-pods` for now?
   - What's the ETA for the v0.7.0 bug fix?

3. **Fallback Strategy:**
   - For the bounty submission, is it acceptable to use mock data as fallback when public endpoints are unavailable?
   - Or do you recommend all participants run their own pNode for testing?

4. **Dashboard Requirements:**
   - Should the dashboard focus on ALL pNodes (registered + unregistered) or just registered ones?
   - Should we display only "online/recently online" nodes from gossip, or include all registered nodes from getProgramAccounts?

Thank you! Just want to make sure I'm building this the right way before the submission deadline.
```

### Versi Bahasa Indonesia (jika lebih nyaman):

```
Halo @Brad|Xandeum I'm NOT DM'ing YOU,

Saya sedang membuat pNode Analytics Dashboard untuk bounty Superteam dan butuh klarifikasi mengenai API public:

1. **Endpoint Public yang Stabil:**
   - Apakah ada endpoint pRPC public yang stabil saat ini untuk dashboard?
   - IP mana dari list Anda (192.190.136.37, 192.190.136.36, dll) yang dijamin berfungsi?
   - Atau sebaiknya saya tunggu bug fix v0.7.0 sebelum test dengan endpoint real?

2. **Method yang Direkomendasikan:**
   - Apakah sebaiknya pakai `get-pods-with-stats` (v0.7.0+) atau tetap `get-pods`?
   - Kapan estimasi bug fix v0.7.0 selesai?

3. **Strategi Fallback:**
   - Untuk submission bounty, apakah boleh pakai mock data sebagai fallback saat endpoint public tidak available?
   - Atau Anda rekomendasikan semua peserta menjalankan pNode sendiri?

4. **Requirement Dashboard:**
   - Apakah dashboard harus fokus ke SEMUA pNodes (registered + unregistered) atau hanya registered?
   - Apakah tampilkan hanya nodes "online/recently online" dari gossip, atau include semua registered nodes dari getProgramAccounts?

Terima kasih! Saya ingin memastikan saya membuat dashboard dengan cara yang benar sebelum deadline submission.
```

---

## 📊 Informasi Tambahan untuk Context:

**Yang sudah saya lakukan:**
- ✅ Implement service layer dengan `get-pods-with-stats`
- ✅ Setup Vite proxy untuk development (CORS-safe)
- ✅ Implement mock data fallback (156 realistic nodes)
- ✅ React Query integration dengan auto-refresh 30s
- ✅ Historical data storage (localStorage)
- ✅ Dashboard UI complete (bento grid layout)

**Masalah yang saya hadapi:**
- ❌ Public endpoints sering timeout atau return 0 nodes
- ❌ v0.7.0 bug membuat gossip network tidak stabil
- ⚠️ Dashboard stuck di loading karena menunggu API response

**Solusi sementara:**
- ✅ Added 5-second timeout ke fetch calls
- ✅ Auto-fallback ke mock data on error
- ✅ Cache management untuk reduce API calls

---

## 🎯 Tujuan Pertanyaan:

1. **Clarity on public endpoints** - mana yang bisa diandalkan
2. **ETA for bug fix** - kapan bisa test dengan real data
3. **Bounty requirements** - apa yang acceptable untuk submission
4. **Data scope** - semua nodes atau hanya subset tertentu

---

## 📌 Referensi Discord Messages:

**Brad's messages yang relevan:**

1. **Public IPs list (Dec 5):**
   ```
   173.212.203.145, 173.212.220.65, 161.97.97.41,
   192.190.136.36, 192.190.136.37, 192.190.136.38,
   192.190.136.28, 192.190.136.29, 207.244.255.1
   ```

2. **New method `get-pods-with-stats` (Dec 8):**
   ```
   curl -X POST http://<ip>:6000/rpc \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","method":"get-pods-with-stats","id":1}'
   ```

3. **v0.7.0 bug acknowledgment (Dec 9):**
   ```
   "we found a bug after we got to 70 peers updated to the new version...
   Fix is in the works."
   ```

---

## ✅ Rekomendasi Action Items:

**Sambil menunggu jawaban:**

1. ✅ Continue dengan mock data implementation
2. ✅ Complete dashboard UI & features
3. ✅ Test dengan IP yang available (jika ada yang work)
4. ✅ Document fallback strategy di README
5. ⏳ Tunggu v0.7.0 bug fix announcement
6. ⏳ Update ke real API setelah endpoints stabil

---

**Channel:** `#apps-developers` atau `#devnet-announcements`  
**Tag:** @Brad|Xandeum I'm NOT DM'ing YOU  
**Urgency:** Medium (bounty deadline approaching)


# Mail-Service Geliştirme Planı (Roadmap)

> Bu dosyayı `README.md` veya `docs/ROADMAP.md` olarak kaydedebilirsin.  
> ✅ = tamamlandı | 🔜 = sıradaki iş | 🛑 = bloklayıcı

---

## Özette Yol
1. **Gün 1–2:** Şema & Validasyon zemini  
2. **Gün 3–4:** RBAC + Admin Todo CRUD  
3. **Gün 5–6:** Socket.IO bildirim + kalıcılık (DB ya da Redis Streams)  
4. **Gün 7:** Admin User CRUD  
5. **Faz 2:** Ölçek (Redis adapter), Streams’e geçiş, mesajlaşma, rate limit, test/observability

---

## Gün 0 — Envanter & Temizlik
- [x] Bağımlılıklar gözden geçirildi (Node, TS, TypeORM, pg, redis, socket.io).
- [ ] `.env.example` güncellendi (`DATABASE_URL`/db parametreleri, `REDIS_URL`, `JWT_SECRET`).
- [x] NPM script’leri çalışır: `dev`, `build`, `start`, `test`.
- [x] TypeORM log gürültüsü azaltıldı (`logging: ["error"]`).
- [x] Sunucu temiz log ile açılıyor; DB/Redis bağlantıları OK.

**Kabul Kriteri:** `npm run dev` temiz; DB/Redis bağlanıyor, hata yok.

---

## Gün 1 — Şema & Migration’lar
- [x] **Users**: `role` eklendi (`'USER' | 'ADMIN'`, default `'USER'`).
- [x] **Todos**: `createdAt`, `updatedAt`, `userId` (FK) net.
- [x] **Index**: `(userId, createdAt)` (liste performansı).
- [x] (Opsiyonel) **Unique**: `(userId, title)` (title tabanlı işlemler için).
- [x] Migration komutları hazır ve **up/down** test edildi.

**Kabul Kriteri:** Taze DB’de migration’lar sorunsuz çalışıyor.

---

## Gün 2 — Hata Yapısı & Validasyon (Zemin)
- [x] **Global error handler**: `AppError(status, code)` + tek middleware; standart JSON hata.
- [x] **Validasyon**: Zod/class-validator ile **body/params/query** şemaları (create/update/delete).
- [x] **DTO’lar**: Yanıt tipleri net (örn. `TodoDTO = { id, userId, title, completed }`).
- [ ] **REST düzeltmeleri planı**: Todo uçlarını **id tabanlı** hale getirme (Gün 4’te).

**Kabul Kriteri:** Geçersiz isteklerde 400/422 standart hata formatı dönüyor.

---

## Gün 3 — RBAC (Role-Based Access Control)
- [ ] JWT payload `role` içeriyor (token üretiminde).
- [ ] **Guard**: `requireRole('ADMIN')` (401 vs 403 ayrımı net).
- [ ] **Admin seed**: başlangıç admin kullanıcısı (script/migration).

**Kabul Kriteri:** `/admin/*` rotalarına yalnızca **ADMIN** erişebiliyor; diğerleri 403.

---

## Gün 4 — Admin → Todo Yönetimi (CRUD)
**Rotalar (sadece ADMIN):**
- [ ] `POST /admin/todos` — hedef kullanıcıya görev ekle (input: userId/email + title + completed)
- [ ] `PATCH /admin/todos/:id` — kısmi güncelle
- [ ] `DELETE /admin/todos/:id`
- [ ] `GET /admin/todos?userId=...&completed=...` — filtreli liste

**Notlar**
- [ ] Tüm rotalarda validasyon şemaları (Zod).
- [ ] **Id tabanlı** işlemler (title çakışması yok).
- [ ] Normal kullanıcı kendi kayıtlarını görür/günceller (mevcut user rotaları korunur).

**Kabul Kriteri:** Admin, istediği kullanıcıya görev ekleyip yönetebiliyor (CRUD çalışıyor).

---

## Gün 5 — Socket.IO Entegrasyonu (Gerçek Zamanlı Bildirim)
- [ ] Socket.IO server, Express’e bağlandı (ayrı init modülü).
- [ ] **Handshake auth**: JWT doğrula → `socket.join(userId)`.
- [ ] **Event**: `"notification:new-task"` (payload: `{ todoId, title, createdAt }`).
- [ ] **Emit noktası**: Admin yeni todo eklediğinde ilgili kullanıcı odasına event gönder.
- [ ] Basit istemci ile manuel test (browser ya da Node client).

**Kabul Kriteri:** Admin görev ekleyince hedef kullanıcı **anında** bildirim alıyor.

---

## Gün 6 — Bildirimlerin Kalıcılığı (DB / Redis Streams)
**Başlangıç önerisi: DB ile başla; sonra Streams’e geç.**

**Seçenek A — DB Notifications (kolay başlangıç)**
- [ ] `notifications` tablosu: `id, userId, type, payload(json), readAt, createdAt`
- [ ] Akış: Todo eklendi → DB’ye kayıt → Socket.IO push → offline kullanıcı `GET /notifications` ile görür
- [ ] Uçlar: 
  - [ ] `GET /notifications` (sayfalama + `unreadCount`)
  - [ ] `PATCH /notifications/:id/read`

**Seçenek B — Redis Streams (güçlü offline teslim)**
- [ ] Stream key: `notifications:<userId>`
- [ ] Producer: todo eklendiğinde `XADD`
- [ ] Consumer: kullanıcı bağlanınca `XREADGROUP` ile backlog → Socket.IO push → `XACK`
- [ ] `XTRIM` ile retention (örn. son 500 olay)

**Kabul Kriteri:** Offline kullanıcı geri geldiğinde **okunmamış bildirimleri** görebiliyor.

---

## Gün 7 — Admin → Kullanıcı Yönetimi (CRUD)
- [ ] Admin user rotaları: `POST/GET/PATCH/DELETE /admin/users`
- [ ] Kurallar: email unique, role atama, silmede FK davranışı (CASCADE/RESTRICT) net.
- [ ] (Opsiyonel) Audit log: “admin X, user Y’yi güncelledi”.

**Kabul Kriteri:** Admin kullanıcı ekleme/silme/güncelleme akışları çalışıyor; validasyon/hata standart.

---

## Faz 2 — İyileştirmeler (Sonraki Sprint)
- [ ] **Socket.IO Redis Adapter**: çoklu Node/pod için `@socket.io/redis-adapter` (fan-out, oda senkron).
- [ ] **Bildirimleri Redis Streams’e taşıma** (garantili offline teslim).
- [ ] **Uygulama içi mesajlaşma**:
  - [ ] Oda tasarımı: `room:<sorted(userA,userB)>`
  - [ ] Saklama: DB (arama kolay) veya Streams (reliable)
  - [ ] “Okundu” durumu + yeni mesaj bildirimi
- [ ] **Rate limiting** (Redis): auth/kritik rotalarda (INCR + EXPIRE).
- [ ] **Logging/Observability**: Pino JSON log, `requestId`, temel metrikler (istek süresi, hata oranı).
- [ ] **E2E testler** (Jest + Supertest): login → admin todo create → bildirim push → unread/read akışları.
- [ ] **Performans**: `limit/offset`, indeks doğrulama, sorgu iyileştirme.

---

## Dökümantasyon (Repo içinde MD olarak tut)
- [ ] **ADR-001: Notification Storage Kararı** — başlangıçta **DB**, sonra **Streams**’e geçiş kriterleri.
- [ ] **ADR-002: RBAC Tasarımı** — token payload (role), guard stratejisi (401 vs 403).
- [ ] **API Contract** — tüm rotalar için istek/yanıt şemaları (OpenAPI ya da MD).
- [ ] **Runbook** — `.env` anahtarları, migration/test komutları, Redis/Socket.IO başlatma notları.

---

## Sık Görülen Bloklayıcılar (Not Al)
- [ ] `req.body` boş → `express.json()` route’lardan önce mi?
- [ ] TypeORM’de yanlış yöntem → ilişki gerekiyorsa `findOne({ relations, where })`.
- [ ] “email’de UUID arıyor” → controller → service **parametre sırası**.
- [ ] `TS2564` → sınıf alanı constructor’da veya tanımda başlatılmalı.
- [ ] Socket.IO prod → **sticky session** + (varsa) Redis adapter.

---

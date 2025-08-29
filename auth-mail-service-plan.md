# 🚀 7 Günlük Öğrenme Projesi: Auth + Mail Servisi

Bu proje 7 günlük kütüphane öğrenme planını **amaçlı bir mini uygulamaya** dönüştürür.  
Çıkışta elinde küçük ama gerçek bir **Authentication + Email Queue Backend** olacak.  

---

## 📌 Proje Özellikleri
- Kullanıcı kayıt & giriş (JWT ile authentication)  
- DTO + Validation (`class-validator`, `class-transformer`)  
- Veritabanında `User` tablosu (UUID id ile)  
- Güvenlik middleware’leri (`helmet`, `cors`, `compression`, `hpp`)  
- Logging sistemi (`winston`)  
- Redis + BullMQ → e-posta kuyruğu (kayıt sonrası hoş geldin maili)  
- Axios → dış API’den kullanıcı bilgisi çekme  

---

## 📌 Akış
1. **/register** →  
   - Input validation (email, password)  
   - DB’ye kaydet (UUID id)  
   - Job kuyruğa ekle → “hoş geldin maili”  
   - Winston ile “yeni kullanıcı” logla  

2. **Worker (queue consumer)** →  
   - Redis’ten job’u al  
   - Mail gönderildiğini simüle et (console.log veya nodemailer)  
   - Log kaydet  

3. **/login** →  
   - Doğru şifre → JWT üret  
   - Yanlış şifre → Error logla  

4. **/profile** →  
   - JWT doğrulaması → user bilgisi döndür  

5. **Axios entegrasyonu** →  
   - `/external-info` → JSONPlaceholder API’den data çek  
   - Kullanıcı profiline ekstra bilgi ekle  

---

## 📂 Dosya Yapısı (Öneri)
```
/auth-mail-service
├── src/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.routes.ts
│   │   ├── user/
│   │   │   └── user.entity.ts
│   │   └── external/
│   │       └── external.controller.ts
│   ├── config/
│   │   ├── data-source.ts      # DB connection
│   │   ├── env.ts              # dotenv + zod validation
│   │   └── logger.ts           # winston
│   ├── jobs/
│   │   ├── mailQueue.ts        # bullmq queue
│   │   └── mailWorker.ts       # worker
│   ├── middlewares/
│   │   ├── validate-dto.ts
│   │   └── auth.middleware.ts
│   ├── app.ts                  # express instance
│   └── server.ts               # app.listen + DB init
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

---

## 📅 7 Günlük Plan ile Bağlantı
- **Gün 1** → DTO & Validation (`/register`)  
- **Gün 2** → Logging (login/register event logları)  
- **Gün 3** → dotenv config (`.env`, `.env.example`, env validation)  
- **Gün 4** → TypeORM + UUID (User tablosu)  
- **Gün 5** → Middleware: helmet, cors, compression, hpp  
- **Gün 6** → BullMQ + Redis (mail kuyruğu)  
- **Gün 7** → Axios ile dış API çağrısı (`/external-info`)  

---

## 🎯 Sonuç
Bir hafta sonunda:  
✅ JWT tabanlı Auth sistemi  
✅ Loglama + Güvenlik katmanı  
✅ DB + Redis destekli altyapı  
✅ Kuyruk sistemi ile arka plan işlemleri  
✅ Dış API entegrasyonu  

Tam anlamıyla **öğrendiğin kütüphanelerin hepsini pratikte kullanan bir mini backend servisi** geliştirmiş olacaksın 🚀

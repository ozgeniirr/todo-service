# 📅 5 Günlük Öğrenme Planı — Express Ek Kütüphaneler

Bu plan ile `cors`, `compression`, `cookie-parser`, `morgan`, `hpp`, `multer`, `passport`, `passport-jwt`, `uuid`, `eslint`, `prettier`, `ts-node-dev`, `tsconfig-paths`, `tsc-alias` gibi kütüphaneleri öğreneceksin.

---

## 🔹 Gün 1 — Temel Express Middlewares
**Hedef:** `cors`, `compression`, `cookie-parser`, `morgan`, `hpp`

- CORS ayarlarını dene (`origin`, `credentials`, `methods`, `allowedHeaders`).
- `/big` gibi büyük JSON endpoint ile `compression`’ı doğrula.
- Cookie yaz/oku (`res.cookie`, `req.cookies`).
- `morgan("dev")` ile gelen istekleri logla.
- `hpp` kullanarak `/echo?role=1&role=2` test et → whitelist davranışını gör.

---

## 🔹 Gün 2 — Dosya Yükleme
**Hedef:** `multer`

- `POST /upload` → tek dosya upload.
- `POST /uploads` → çoklu dosya upload.
- Disk depolama yerine memory storage dene.
- Boyut limiti/uzantı filtresi ekle.

---

## 🔹 Gün 3 — Kimlik Doğrulama
**Hedef:** `passport`, `passport-jwt`

- Login → JWT üret.
- `/profile` → `passport-jwt` ile koru.
- Yanlış/expire token senaryolarını test et (`401`, `403`).

---

## 🔹 Gün 4 — Yardımcı Araçlar & Kod Kalitesi
**Hedef:** `uuid`, ESLint, Prettier

### `uuid`
- `uuid` ile benzersiz id üret (ör. userId).
- Farklı versiyonları (v4 rastgele, v1 zaman tabanlı) öğren.

### **ESLint**
- **Ne yapar?** Kod kalitesini kontrol eder, hatalı kalıpları yakalar.
- **Ekstra paketler:**  
  - `@typescript-eslint/parser` → ESLint’in TS’yi anlamasını sağlar.  
  - `@typescript-eslint/eslint-plugin` → TS kuralları.  
  - `eslint-config-airbnb-typescript` → Airbnb stil rehberi.  
  - `eslint-config-prettier` → Prettier ile çakışmaları kapatır.  
  - `eslint-plugin-prettier` → Prettier’ı ESLint kuralı gibi çalıştırır.
- **Görev:**  
  - `.eslintrc.cjs` dosyası oluştur.  
  - `npm run lint` ve `npm run lint:fix` çalıştır.  
  - Uyarıları/hataları çöz, kuralları deneyerek öğren.

### **Prettier**
- Otomatik kod biçimlendirici.  
- `.prettierrc` dosyası ekle (ör. tek tırnak, satır genişliği).  
- `npm run format` ile kodu düzenle.

---

## 🔹 Gün 5 — Geliştirme Akışı & Alias
**Hedef:** `ts-node-dev`, `tsconfig-paths`, `tsc-alias`

- `tsconfig.json` → `baseUrl` ve `paths` ekle (`@/*` → `src/*`).
- Dev ortamında:  
  ```bash
  ts-node-dev -r tsconfig-paths/register src/server.ts
  ```
- Build sonrası:  
  ```bash
  tsc && tsc-alias
  ```
- `dist/` altındaki alias importlarının relative path’e dönüştüğünü doğrula.

---

## ✅ Kontrol Listesi
- [ ] CORS preflight testi başarılı  
- [ ] `/big` → `content-encoding: gzip`  
- [ ] Cookie yaz/oku çalışıyor  
- [ ] `/upload` dosya yolunu/sayısını doğru döndürüyor  
- [ ] `/login` → token, `/profile` → JWT ile korunuyor  
- [ ] `uuid` benzersiz id üretiyor  
- [ ] `npm run lint` → hatasız  
- [ ] `npm run format` → kod düzgün biçimlendi  
- [ ] `npm run build && npm start` alias’larla çalışıyor

# Kivvat (Regu-Track) 🛡️

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Tech Stack](https://img.shields.io/badge/stack-NestJS%20%7C%20Next.js%20%7C%20Prisma-blue)
![License](https://img.shields.io/badge/license-Private-red)
![Compliance](https://img.shields.io/badge/compliance-ISO27001%20%7C%20SOC2-orange)

> **Kurumsal Uyumluluk Otomasyonu & Güvenlik Gözlem Platformu**

Kivvat, denetim hazırlık süreçlerini (SOC2, ISO 27001, KVKK) ve altyapı güvenliği takibini otomatize eden, yeni nesil bir güvenlik platformudur.

Geleneksel araçların aksine ağır ajan (agent) kurulumu gerektirmez. **Agentless (Ajansız)** mimarisi sayesinde bulut altyapınızı (AWS, Azure, GCP) anlık olarak tarar ve güvenlik duruşunuzun görsel haritasını çıkarır.

---

## 🚀 Öne Çıkan Özellikler

### 🔌 Ajansız Çoklu Bulut Taraması (Agentless Scanning)
Sunucularınıza hiçbir yazılım yüklemeden, sadece API bağlantısı ile dakikalar içinde tarama başlatın.
- **AWS**: IAM, S3, EC2, CloudTrail denetimleri.
- **Azure**: Storage, SQL, VM Güvenliği.
- **GCP**: IAM, Cloud SQL, Compute Engine.

### 📊 Birleşik Uyumluluk Paneli
Teknik bulguları otomatik olarak uyumluluk maddeleriyle eşleştirin.
- **Standartlar**: ISO 27001, SOC 2 Type II, KVKK.
- **Görsellik**: Gerçek zamanlı uyumluluk karne ve ilerleme grafikleri.
- **Raporlama**: "Yönetici Özeti" içeren tek tıkla profesyonel PDF raporları.

### 📜 Politika Yönetimi & Dijital İmza
Uyumluluğun insan tarafını yönetin.
- **Politika Merkezi**: Çalışanlara güvenlik politikalarını atayın ve okuma durumunu takip edin.
- **Şablonlar**: ISO uyumlu hazır politika şablon kütüphanesi.
- **Dijital İmza**: Zaman damgalı onay takibi.

### 📸 Arayüz Önizlemesi

<div align="center">
  <img src="./assets/1.png" width="100%" />
  <img src="./assets/2.png" width="100%" />
  <img src="./assets/3.png" width="100%" />
  <img src="./assets/4.png" width="100%" />
  <img src="./assets/5.png" width="100%" />
</div>

### 🔐 Denetçi Portalı (Auditor Portal)
Dış denetim sürecini hızlandırın.
- **Güvenli Paylaşım**: Denetçilere süre kısıtlamalı, sadece okuma yetkili güvenli linkler verin.
- **Kanıt Arşivi**: Tüm denetim kontrollerinin ve kanıtların değiştirilemez kayıtları.

---

## 🛠️ Teknolojik Altyapı

Yüksek performanslı, "Type-Safe" monorepo mimarisi ile geliştirilmiştir:

| Bileşen | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Backend** | [NestJS](https://nestjs.com/) | Modüler ve ölçeklenebilir Node.js framework'ü. |
| **Frontend** | [Next.js 16](https://nextjs.org/) | React Server Components, App Router. |
| **Veritabanı** | PostgreSQL & [Prisma](https://www.prisma.io/) | Tip güvenli veritabanı erişimi ve şema yönetimi. |
| **Arayüz** | [Shadcn/UI](https://ui.shadcn.com/) | Erişilebilir, özelleştirilebilir modern bileşenler. |
| **Tarama** | AWS/Azure/GCP SDKs | Doğal bulut entegrasyonları. |

---

## ⚡ Hızlı Başlangıç

### Gereksinimler
- Node.js (v20+)
- PostgreSQL Veritabanı
- Bulut Erişim Bilgileri (AWS/Azure/GCP) _(Local geliştirme için opsiyonel)_

### Kurulum

1. **Projeyi Klonlayın:**
   ```bash
   git clone https://github.com/lxppyter/kivvat.git
   cd kivvat
   ```

2. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

3. **Çevresel Değişkenleri Ayarlayın:**
   `apps/api` içinde `.env` dosyası oluşturun (bkz: `.env.example`).
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/db"
   JWT_SECRET="gizli-anahtar-olusturun"
   FRONTEND_URL="http://localhost:3000"
   ```

4. **Veritabanını Hazırlayın:**
   ```bash
   npx prisma migrate dev
   ```

5. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:3001`
   - Backend: `http://localhost:3000`

---

## 📂 Proje Yapısı

```
kivvat/
├── apps/
│   ├── api/          # NestJS Backend (Tarama Motoru, REST API)
│   └── web/          # Next.js Frontend (Dashboard, Denetçi Portalı)
├── packages/         # Ortak kütüphaneler ve konfigürasyonlar
└── turbo.json        # TurboRepo build yapılandırması
```

---

## 📝 Yol Haritası (Roadmap)

- [x] Çoklu Bulut Desteği (AWS, Azure, GCP)
- [x] Uyumluluk Raporlama Motoru
- [x] Politika Yönetimi
- [ ] **Olay Müdahale (Incident Response) Kaydı** (Planlanan)
- [ ] **SSL/TLS Sertifika Takibi** (Planlanan)
- [ ] **İyileştirme Rehberi (Remediation Scenarios)** (Planlanan)

---

&copy; 2026 Kivvat Inc. Tüm Hakları Saklıdır.

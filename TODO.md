# 📝 Project Roadmap & Todo

Bu dosya Kivvat projesinin anlık durumunu, tamamlanan özellikleri ve yapılması gereken eksikleri içerir. Son teknik denetim (Audit) sonuçlarına göre güncellenmiştir.

## 🔐 Kimlik Doğrulama (Authentication)
- [x] **Kayıt Ol (Register):** Validasyonlu, güvenli kayıt akışı.
- [x] **Giriş Yap (Login):** JWT tabanlı, Argon2/Bcrypt korumalı giriş.
- [x] **Oturum Yönetimi:** Access/Refresh Token mekanizması (Silent Refresh).

## 🛡️ Güvenlik Önlemleri (Security)
- [x] **Rate Limiting:** API Throttling.
- [x] **Helmet & CORS:** Güvenlik başlıkları.
- [x] **Input Validation:** `class-validator` ile katı veri kontrolü.
- [ ] **2FA (Opsiyonel):** Kritik işlemler için MFA altyapısı.

## 📊 Dashboard & Arayüz (Frontend)
- [x] **Dashboard UI:** Shadcn UI bileşenleri, interaktif widgetlar.
- [x] **Canlı Veri:** Mock veriden arındırılmış, DB bağlantılı dashboard.
- [x] **Compliance Status:** Standartlara göre (ISO 27001) anlık uyumluluk skoru.

## ☁️ Cloud-Guardian (Altyapı Denetim)
- [x] **Scanner Engine:**
    - [x] **IAM:** Root MFA, Access Keys, Ghost Accounts (90 gün).
    - [x] **Storage:** S3 Encryption, Public Access Block.
    - [x] **Network:** Security Groups (Port 22/3389 0.0.0.0/0 kontrolü).
    - [x] **Risk Scoring:** Kritik/Yüksek/Orta seviye risk analizi.
- [ ] **Multi-Cloud Support:**
    - [x] AWS Entegrasyonu.
    - [ ] Azure Entegrasyonu (Stub mevcut).
    - [ ] GCP Entegrasyonu (Stub mevcut).

## 📸 Evidence-Auto (Otomatik Kanıt)
- [x] **Timestamped Evidence:** Kanıtların zaman damgasıyla DB'ye kaydı.
- [x] **Auto-Screenshooter:**
    - [x] API kanıtlarının görsel ekran görüntüsüne dönüştürülmesi (Puppeteer/Playwright).
- [x] **Version History:**
    - [x] Denetim geçmişi (Scan History).
    - [x] **Politika Versiyonlama:** Şirket politikalarının (v1.0 -> v1.2) versiyon takibi.

## 📦 Asset-Intel (Varlık Yönetimi)
- [x] **Cloud Inventory:** AWS (EC2, S3, IAM) kaynaklarının otomatik keşfi.
- [ ] **Detailed Asset Mgmt:**
    - [ ] **Hardware Inventory:** Fiziksel cihaz ekleme/düzenleme (Manuel).
    - [ ] **Software Registry:** Lisans takibi ve bitiş süresi uyarıları.
    - [ ] **Endpoint Security:** Laptop/PC disk şifreleme kontrolü (Agent/Checklist).

## 📜 Policy-Forge (Mevzuat Kütüphanesi)
- [x] **Hazır Şablonlar:** Dinamik değişkenli ({{companyName}}) ISO/SOC2 şablonları.
- [x] **Employee Awareness:** Personel politika atama, imzalama ve takip.
- [x] **Gap Analysis:** Standart bazında eksiklik analizi dashboardu.

## 💼 Auditor-X (Denetçi Portalı)
- [ ] **Safe-Link Access:** Denetçiler için sadece okuma yetkili, süreli paylaşım linki.
- [ ] **One-Click Export:**
    - [x] Tüm uyumluluk durumunun tek PDF/Excel paketi olarak ihracı.
    - [ ] Denetçi dostu klasör yapısında çıktı (Zip).

---

### ✅ Tamamlanan Temel Yapıtaşları
- [x] Monorepo Kurulumu (NestJS + Next.js).
- [x] Cyber-Aesthetic Tasarım Dili.
- [x] Landing Page.

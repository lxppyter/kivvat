# 📝 Project Roadmap & Todo

Bu dosya Kivvat projesinin anlık durumunu, tamamlanan özellikleri ve yapılması gereken eksikleri içerir. Son teknik denetim (Audit) sonuçlarına göre güncellenmiştir.

### ✅ Tamamlanan Temel Yapıtaşları
- [x] Monorepo Kurulumu (NestJS + Next.js).
- [x] Cyber-Aesthetic Tasarım Dili.
- [x] Landing Page.

## 🔐 Kimlik Doğrulama (Authentication)
- [x] **Kayıt Ol (Register):** Validasyonlu, güvenli kayıt akışı. [CORE]
- [x] **Giriş Yap (Login):** JWT tabanlı, Argon2/Bcrypt korumalı giriş. [CORE]
- [x] **Oturum Yönetimi:** Access/Refresh Token mekanizması (Silent Refresh). [CORE]

## 🛡️ Güvenlik Önlemleri (Security)
- [x] **Rate Limiting:** API Throttling.
- [x] **Helmet & CORS:** Güvenlik başlıkları.
- [x] **Input Validation:** `class-validator` ile katı veri kontrolü.
- [ ] **2FA (Opsiyonel):** Kritik işlemler için MFA altyapısı.

## 📊 Dashboard & Arayüz (Frontend)
- [x] **Dashboard UI:** Shadcn UI bileşenleri, interaktif widgetlar. [CORE]
- [x] **Canlı Veri:** Mock veriden arındırılmış, DB bağlantılı dashboard. [CORE]
- [x] **Compliance Status:** Standartlara göre (ISO 27001) anlık uyumluluk skoru. [CORE]

## ☁️ Cloud-Guardian (Altyapı Denetim)
- [x] **Scanner Engine:**
    - [x] **IAM:** Root MFA, Access Keys, Ghost Accounts (90 gün). [CORE]
    - [x] **Storage:** S3 Encryption, Public Access Block. [CORE]
    - [x] **Network:** Security Groups (Port 22/3389 0.0.0.0/0 kontrolü). [CORE]
    - [x] **Risk Scoring:** Kritik/Yüksek/Orta seviye risk analizi. [CORE]
- [x] **Multi-Cloud Support:**
    - [x] AWS Entegrasyonu. [CORE]
    - [x] Azure Entegrasyonu. [PRO]
        - **Dependencies**: `@azure/identity`, `@azure/arm-subscriptions`.
        - **Auth**: Service Principal (Client ID, Secret, Tenant).
        - **Verification**: List Subscriptions to verify access.
    - [x] GCP Entegrasyonu. [PRO]
        - **Dependencies**: `@google-cloud/resource-manager`.
        - **Auth**: Service Account JSON Key.
        - **Verification**: `ProjectsClient.getProject`.

## 📸 Evidence-Auto (Otomatik Kanıt)
- [x] **Timestamped Evidence:** Kanıtların zaman damgasıyla DB'ye kaydı. [CORE]
- [x] **Auto-Screenshooter:**
    - [x] API kanıtlarının görsel ekran görüntüsüne dönüştürülmesi (Puppeteer/Playwright). [CORE]
- [x] **Version History:**
    - [x] Denetim geçmişi (Scan History). [CORE]
    - [x] **Politika Versiyonlama:** Şirket politikalarının (v1.0 -> v1.2) versiyon takibi. [CORE]

## 📦 Asset-Intel (Varlık Yönetimi)
- [x] **Cloud Inventory:** AWS (EC2, S3, IAM) kaynaklarının otomatik keşfi. [CORE]
- [x] **Detailed Asset Mgmt:**
    - [x] **Hardware Inventory:** Fiziksel cihaz ekleme/düzenleme (Manuel). [CORE]
    - [x] **Software Registry:** Lisans takibi ve bitiş süresi uyarıları. [CORE]
    - [x] **Endpoint Security:** Laptop/PC disk şifreleme kontrolü (Agent/Checklist). [CORE]

## 📜 Policy-Forge (Mevzuat Kütüphanesi)
- [x] **Hazır Şablonlar:** Dinamik değişkenli ({{companyName}}) ISO/SOC2 şablonları. [CORE]
- [x] **Employee Awareness:** Personel politika atama, imzalama ve takip. [CORE]
- [x] **Gap Analysis:** Standart bazında eksiklik analizi dashboardu. [CORE]

## 💼 Auditor-X (Denetçi Portalı) [ENTERPRISE]
- [x] **Safe-Link Access:** Denetçiler için sadece okuma yetkili, süreli paylaşım linki. [ENTERPRISE]
    - [x] **One-Click Export:**
    - [x] Tüm uyumluluk durumunun tek PDF/Excel paketi olarak ihracı. [PRO]
    - [x] Denetçi dostu klasör yapısında çıktı (Zip). [PRO]
    - [x] **Incident Response Log:** Güvenlik ihlallerinin tespit, müdahale ve kapanış kayıtları. [PRO]

## 🚀 Gelecek Planları (Upcoming)
- [x] **SSL/TLS Certificate Monitor:** Load Balancer ve Endpoint sertifikalarının süre kontrolü. [PRO]
- [x] **Remediation Guidance:** Zafiyetler için adım adım iyileştirme rehberleri. [PRO]
- [x] **Configuration Drift:** Yapılandırma değişikliklerinin (Diff) analizi. [PRO]
- [x] **Tedarikçi (Vendor) Risk Yönetimi:** 3. taraf yazılımların sertifika/güvenlik takibi. [PRO]
- [x] **Ödeme Altyapısı (Gumroad):** Lisans anahtarı doğrulama (License Key Verification) sistemi.
- [ ] **Landing Page UI & İçerik İyileştirmeleri:** Tasarımın cilalanması ve pazarlama metinlerinin güçlendirilmesi.
- [x] **Sistem Güvenlik İyileştirmeleri:** OWASP Top 10 zafiyetlerine (Injection, Broken Auth vb.) göre sistemin güçlendirilmesi.

## 💰 Abonelik ve Paketleme (SaaS Model)
- [x] **Feature Gating:** Frontend (RequirePro) ve Backend (SubscriptionGuard) korumaları.
- [x] **Limit Enforcement:** Paket tabanlı kaynak (1/3/Sınırsız) ve standart (KVKK/ISO/SOC2) limitleri.
- [x] **Prepaid License Model:** Ön ödemeli lisans anahtarı ile "Free -> Pro" yükseltme akışı.
- [x] **Total Lockdown:** Free kullanıcılar için tam erişim kısıtlaması (Billing hariç).
"use client";

import { useState, useEffect } from "react";
import { Shield } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

const TABS = [
  { id: "privacy", label: "Gizlilik Politikası" },
  { id: "terms", label: "Hizmet Şartları" },
  { id: "kvkk", label: "KVKK Aydınlatma Metni" },
];

export default function LegalPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("privacy");

  useEffect(() => {
    // Basic hash handling to switch tabs if URL is /legal#terms etc.
    // Next.js app router doesn't expose hash easily in server components, 
    // but client side we can check window.location.hash
    const handleHashChange = () => {
        const hash = window.location.hash.replace("#", "");
        if (['privacy', 'terms', 'kvkk'].includes(hash)) {
            setActiveTab(hash);
        }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight text-neutral-900">Kivvat</span>
            <span className="mono-badge text-xs text-neutral-400 ml-2">/ YASAL</span>
          </Link>
          <Link href="/">
             <Button variant="ghost" className="font-mono text-xs uppercase">Geri Dön</Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-32 max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Yasal Bilgilendirme</h1>
        
        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 mb-12">
            {TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => {
                        setActiveTab(tab.id);
                        window.location.hash = tab.id;
                    }}
                    className={`mr-8 pb-4 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${
                        activeTab === tab.id 
                        ? "border-primary text-primary" 
                        : "border-transparent text-neutral-500 hover:text-neutral-900"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Content */}
        <div className="prose prose-neutral max-w-none">
            {activeTab === "privacy" && <PrivacyContent />}
            {activeTab === "terms" && <TermsContent />}
            {activeTab === "kvkk" && <KvkkContent />}
        </div>
      </main>
    </div>
  );
}

function PrivacyContent() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-4">Gizlilik Politikası</h2>
            <p className="text-neutral-600 mb-4">Son Güncelleme: 20 Ocak 2026</p>
            <p>Kivvat Inc. ("Kivvat", "biz"), gizliliğinize önem verir. Bu Gizlilik Politikası, hizmetlerimizi kullandığınızda topladığımız bilgileri ve bunları nasıl koruduğumuzu açıklar.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">1. Toplanan Veriler</h3>
            <p>Hizmetimizi sağlamak için aşağıdaki verileri işleyebiliriz:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li><strong>Hesap Bilgileri:</strong> Ad, e-posta adresi ve fatura bilgileri.</li>
                <li><strong>Altyapı Meta-Verileri:</strong> Bağlı bulut hesaplarınızdan (AWS, Azure, GCP) alınan konfigürasyon ve güvenlik ayarları.</li>
                <li><strong>Kullanım Verileri:</strong> IP adresi, tarayıcı türü ve sistem logları.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">2. Veri Kullanımı</h3>
            <p>Verilerinizi asla üçüncü taraflara satmayız. Bilgilerinizi sadece şu amaçlarla kullanırız:</p>
            <ul className="list-disc pl-6 space-y-2">
                <li>Güvenlik taramalarını gerçekleştirmek ve rapor oluşturmak.</li>
                <li>Hizmet kalitesini artırmak ve teknik destek sağlamak.</li>
                <li>Yasal yükümlülüklere (KVKK, GDPR) uyum sağlamak.</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">3. Veri Güvenliği</h3>
            <p>Verileriniz endüstri standardı şifreleme (AES-256) ile korunur. Bulut hesaplarınıza erişimimiz "Read-Only" (Salt Okunur) yetkisiyle sınırlıdır; veritabanı içeriğinize erişim iznimiz yoktur.</p>
        </div>
    );
}

function TermsContent() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-4">Hizmet Şartları</h2>
            <p className="text-neutral-600 mb-4">Son Güncelleme: 20 Ocak 2026</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">1. Hizmetin Tanımı</h3>
            <p>Kivvat, işletmeler için otomatik uyumluluk ve güvenlik denetim platformudur. Hizmeti kullanarak, sistemin "olduğu gibi" sunulduğunu kabul edersiniz.</p>

            <h3 className="text-xl font-bold mt-8 mb-4">2. Hesap Sorumluluğu</h3>
            <p>Hesabınızın güvenliğinden siz sorumlusunuz. Hesabınız altında gerçekleşen tüm işlemlerden sorumlu tutulacaksınız. Şüpheli bir durum fark ederseniz derhal bize bildirmelisiniz.</p>

            <h3 className="text-xl font-bold mt-8 mb-4">3. İptal ve İade</h3>
            <p>Aboneliğinizi dilediğiniz zaman iptal edebilirsiniz. Peşin ödenen dönemler için ücret iadesi yapılmaz, ancak dönem sonuna kadar erişim hakkınız devam eder.</p>

            <h3 className="text-xl font-bold mt-8 mb-4">4. Fikri Mülkiyet</h3>
            <p>Kivvat platformu, logosu ve tüm yazılım kodları Kivvat Inc.'in mülkiyetindedir. İzinsiz kopyalanamaz veya tersine mühendislik yapılamaz.</p>
        </div>
    );
}

function KvkkContent() {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-4">KVKK Aydınlatma Metni</h2>
            <p className="text-neutral-600 mb-4">Veri Sorumlusu: Kivvat Inc.</p>
            
            <h3 className="text-xl font-bold mt-8 mb-4">Amaç</h3>
            <p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz aşağıda açıklanan kapsamda işlenebilecektir.</p>

            <h3 className="text-xl font-bold mt-8 mb-4">İşlenen Kişisel Veriler</h3>
            <p>Kimlik bilgileri, iletişim bilgileri, müşteri işlem bilgileri ve işlem güvenliği bilgileri tarafımızca işlenmektedir.</p>

            <h3 className="text-xl font-bold mt-8 mb-4">Haklarınız</h3>
            <p>KVKK'nın 11. maddesi uyarınca veri sahibi olarak; verilerinizin işlenip işlenmediğini öğrenme, yanlış ise düzeltilmesini isteme ve silinmesini talep etme hakkına sahipsiniz.</p>
            <p className="mt-4">Talepleriniz için: <a href="mailto:privacy@kivvat.com" className="text-primary hover:underline">privacy@kivvat.com</a></p>
        </div>
    );
}

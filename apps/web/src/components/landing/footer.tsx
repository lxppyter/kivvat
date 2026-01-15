import { Shield } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="bg-[#0b0b0b] text-[#e7e6d9] py-16 border-t border-[#252525]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white font-heading">Kivvat</span>
            </div>
            <p className="text-sm text-neutral-400">
              Modern şirketler için yeni nesil siber güvenlik ve uyumluluk otomasyonu.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Ürün</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Özellikler</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Entegrasyonlar</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fiyatlandırma</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Güncellemeler</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Şirket</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Hakkımızda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Kariyer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors">İletişim</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Yasal</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Gizlilik Politikası</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hizmet Şartları</a></li>
              <li><a href="#" className="hover:text-white transition-colors">KVKK</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
          <p>&copy; 2026 Kivvat Inc. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

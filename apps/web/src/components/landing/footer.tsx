import { Shield } from "lucide-react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="bg-[#0b0b0b] text-[#e7e6d9] py-16 border-t border-[#252525]">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <Shield className="h-8 w-8 text-white group-hover:text-primary transition-colors" />
              <span className="text-2xl font-bold text-white font-heading">Kivvat</span>
            </Link>
            <p className="text-sm text-neutral-400">
              Modern şirketler için yeni nesil siber güvenlik ve uyumluluk otomasyonu.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Ürün</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/#features" className="hover:text-white transition-colors">Özellikler</Link></li>
              <li><Link href="/#pricing" className="hover:text-white transition-colors">Fiyatlandırma</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Giriş Yap</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Hesap Oluştur</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Şirket</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/contact" className="hover:text-white transition-colors">İletişim</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Destek Talebi</Link></li>
              <li><Link href="/#faq" className="hover:text-white transition-colors">S.S.S</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Yasal</h4>
            <ul className="space-y-4 text-sm">
              <li><Link href="/legal#privacy" className="hover:text-white transition-colors">Gizlilik Politikası</Link></li>
              <li><Link href="/legal#terms" className="hover:text-white transition-colors">Hizmet Şartları</Link></li>
              <li><Link href="/legal#kvkk" className="hover:text-white transition-colors">KVKK Aydınlatma</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm gap-4">
          <p>&copy; 2026 Kivvat Inc. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <a href="https://x.com/lxppyter" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
            <a href="https://www.linkedin.com/in/lxppyter/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://github.com/lxppyter" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

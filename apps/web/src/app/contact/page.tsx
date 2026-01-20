import { LandingNavbar } from "@/components/landing/navbar";
import { LandingFooter } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-white selection:bg-primary/20 selection:text-primary flex flex-col">
      <LandingNavbar />
      
      <div className="flex-1 flex flex-col justify-center pt-32 pb-24">
        <div className="container mx-auto px-6 max-w-xl">
          <div className="mb-12 text-center">
            <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase mb-4 block">
                İLETİŞİM
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tighter text-neutral-900 mb-6">
                Bize Ulaşın.
            </h1>
            <p className="text-neutral-500 text-lg font-light">
                Fast-Track başvurusu veya diğer sorularınız için formu doldurun. En geç 2 saat içinde dönüş yapıyoruz.
            </p>
          </div>

          <form className="space-y-6 bg-neutral-50 p-8 border border-neutral-200 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad</Label>
                    <Input id="name" placeholder="John Doe" className="bg-white border-neutral-200" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input id="email" type="email" placeholder="john@company.com" className="bg-white border-neutral-200" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="subject">Konu</Label>
                <Input id="subject" placeholder="Fast-Track Başvurusu" className="bg-white border-neutral-200" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Mesajınız</Label>
                <Textarea 
                    id="message" 
                    placeholder="Şirketiniz ve ihtiyaçlarınız hakkında kısa bilgi..." 
                    className="min-h-[150px] bg-white border-neutral-200 resize-none" 
                />
            </div>

            <Button className="w-full h-12 font-mono uppercase tracking-widest text-xs">
                GÖNDER
            </Button>
            
            <p className="text-center text-xs text-neutral-400 mt-4">
                veya direkt e-posta gönderin: <a href="mailto:hello@kivvat.com" className="underline hover:text-primary">hello@kivvat.com</a>
            </p>
          </form>
        </div>
      </div>

      <LandingFooter />
    </main>
  );
}

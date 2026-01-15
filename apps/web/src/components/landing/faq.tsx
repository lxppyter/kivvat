import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "item-1",
    question: "Verilerimiz güvende mi?",
    answer: "Evet. Sistemimiz “Zero-Data Access” prensibiyle çalışır. Sadece bulut altyapınızın konfigürasyon meta-verilerini (metadata) okuyoruz. Veritabanlarınızın içeriğine veya kişisel verilerinize asla erişmiyoruz."
  },
  {
    id: "item-2",
    question: "Hangi bulut sağlayıcılarını destekliyorsunuz?",
    answer: "Şu anda AWS, Microsoft Azure ve Google Cloud Platform (GCP) servislerini tam kapsamlı olarak destekliyoruz. Hibrit yapılar için de özel çözümlerimiz mevcuttur."
  },
  {
    id: "item-3",
    question: "Denetim garantisi veriyor musunuz?",
    answer: "Sistemimiz sizi teknik olarak denetime %100 hazır hale getirir. Kontrol noktalarımız ISO ve SOC2 denetçilerinin beklentilerine göre tasarlanmıştır. Ayrıca Enterprise planımızda denetim sürecinde bizzat danışmanlık desteği de sunuyoruz."
  },
  {
    id: "item-4",
    question: "Kurulum ne kadar sürer?",
    answer: "Agentless (ajan kurulumu gerektirmeyen) yapımız sayesinde bağlantı dakikalar içinde tamamlanır. İlk tarama raporunuzu bağlantıdan hemen sonra, genellikle 5 dakika içinde alırsınız."
  },
  {
    id: "item-5",
    question: "Slack veya Jira ile entegre çalışır mı?",
    answer: "Kesinlikle. Güvenlik ve yazılım ekiplerinizin akışını bozmamak için Slack, Microsoft Teams, Jira ve Linear entegrasyonlarımız mevcuttur. Kritik bir bulgu olduğunda anında bildirim alırsınız veya otomatik ticket açılır."
  },
  {
    id: "item-6",
    question: "Ücretsiz deneme süresi var mı?",
    answer: "Evet, Growth planımızı 14 gün boyunca ücretsiz deneyebilirsiniz. Kredi kartı bilgisi girmeniz gerekmez. Sadece hesap oluşturun ve taramaya başlayın."
  },
  {
    id: "item-7",
    question: "İstediğim zaman iptal edebilir miyim?",
    answer: "Tabii ki. Taahhüt yok. Memnun kalmazsanız panel üzerinden tek tıkla aboneliği durdurabilirsiniz. Kullanmadığınız günlerin ücreti iade edilmez ancak dönem sonuna kadar erişiminiz devam eder."
  },
  {
    id: "item-8",
    question: "Şirketimize özel kurallar tanımlayabilir miyiz?",
    answer: "Evet, 'Policy-as-Code' motorumuz sayesinde kendi özel güvenlik kurallarınızı (Custom Policies) yazabilir veya mevcut şablonları şirket politikalarınıza göre düzenleyebilirsiniz."
  }
];

export function FAQ() {
  const mid = Math.ceil(faqs.length / 2);
  const leftCol = faqs.slice(0, mid);
  const rightCol = faqs.slice(mid);

  return (
    <section className="bg-white border-b border-gray-200 min-h-screen flex flex-col justify-center py-32">
       {/* Section Header */}
       <div className="container mx-auto px-6 py-20 border-x border-gray-100 bg-white">
          <span className="font-mono text-sm font-bold text-primary tracking-widest uppercase mb-4 block">
            DESTEK & BİLGİ
          </span>
          <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-500 max-w-3xl leading-[0.9] pb-2 pt-1">
            SIKÇA SORULAN <br />
            SORULAR.
          </h2>
       </div>

       {/* FAQ Accordion List - Split Layout */}
       <div className="border-t border-b border-gray-200 bg-white">
         <div className="container mx-auto grid lg:grid-cols-2 gap-x-16 border-x border-gray-100">
            
            {/* Left Column */}
            <div className="border-r border-gray-200">
                <Accordion type="single" collapsible className="w-full">
                    {leftCol.map((faq, idx) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border-b border-gray-200 last:border-0 px-6 py-4">
                            <AccordionTrigger className="w-full text-xl lg:text-2xl font-bold text-neutral-900 hover:text-primary hover:no-underline py-6 text-left font-mono">
                                <span className="flex items-center gap-4 text-left">
                                    <span className="text-neutral-300 text-sm font-normal shrink-0">0{idx + 1}</span> 
                                    <span>{faq.question}</span>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-lg text-neutral-600 leading-relaxed pb-8 pl-10">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

            {/* Right Column */}
            <div className="">
                <Accordion type="single" collapsible className="w-full">
                    {rightCol.map((faq, idx) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border-b border-gray-200 last:border-0 px-6 py-4">
                            <AccordionTrigger className="w-full text-xl lg:text-2xl font-bold text-neutral-900 hover:text-primary hover:no-underline py-6 text-left font-mono">
                                <span className="flex items-center gap-4 text-left">
                                    <span className="text-neutral-300 text-sm font-normal shrink-0">0{idx + mid + 1}</span>
                                    <span>{faq.question}</span>
                                </span>
                            </AccordionTrigger>
                            <AccordionContent className="text-lg text-neutral-600 leading-relaxed pb-8 pl-10">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>

         </div>
       </div>

    </section>
  );
}

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "item-1",
    question: "Kivvat OS tam olarak nedir?",
    answer: "Kivvat, bulut altyapınızı 7/24 izleyen, otomatik güvenlik taramaları yapan ve uyumluluk süreçlerini (ISO 27001, SOC 2) yöneten otonom bir dijital güvenlik mühendisidir. İnsan hatasını ortadan kaldırır."
  },
  {
    id: "item-2",
    question: "Verilerim güvende mi?",
    answer: "Kesinlikle. Sistemimiz altyapınıza sadece ve sadece 'Okuma' (Read-Only) yetkisiyle bağlanır. Verilerinizi değiştiremez, silemez veya kopyalayamaz. 'Zero-Data Access' prensibiyle çalışır."
  },
  {
    id: "item-3",
    question: "Fast-Track hizmeti nedir?",
    answer: "Abonelik yerine 'Proje Bazlı' bir çözümdür. Acil denetim ihtiyacı olan şirketler için tasarlanmıştır. 90 gün içinde denetime hazır hale gelme garantisi sunar ve tek seferlik ödeme ile çalışır."
  },
  {
    id: "item-4",
    question: "Hangi bulut servislerini destekliyorsunuz?",
    answer: "AWS, Microsoft Azure ve Google Cloud (GCP) ile tam entegre çalışır. Çoklu bulut (Multi-Cloud) yapılarını tek bir panelden yönetebilirsiniz."
  },
  {
    id: "item-5",
    question: "Ajan (Agent) kurmam gerekiyor mu?",
    answer: "Hayır. Kivvat tamamen 'Agentless' çalışır. Sunucularınıza herhangi bir yazılım kurmanıza gerek yoktur. API üzerinden dakikalar içinde bağlanır ve taramaya başlar."
  },
  {
    id: "item-6",
    question: "Denetim garantisi veriyor musunuz?",
    answer: "Teknik olarak evet. Sistemimiz kontrol noktalarını ISO ve SOC2 denetçilerinin beklentilerine göre %100 uyumlu hale getirir. Enterprise planda bizzat danışmanlık desteği de sağlıyoruz."
  },
  {
    id: "item-7",
    question: "İstediğim zaman iptal edebilir miyim?",
    answer: "Evet, hiçbir taahhüt yoktur. Panel üzerinden tek tıkla aboneliğinizi durdurabilirsiniz. Kullanmadığınız günlerin iadesi yapılmaz ancak dönem sonuna kadar erişiminiz devam eder."
  },
  {
    id: "item-8",
    question: "Özel güvenlik kuralları yazabilir miyim?",
    answer: "Evet, 'Policy-as-Code' motorumuz sayesinde şirketimze özel güvenlik kurallarını (Custom Policies) sisteme tanımlayabilir ve otomatik olarak denetleyebilirsiniz."
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

"use client";



const partners = [
  "TechGlobal", "CyberGuard", "DataFlow", "CloudScale", "SecureNet", "FinBase", "HealthCore", "EduTech"
];

export function Marquee() {
  return (
    <section className="py-12 border-y border-slate-100 bg-white/50 backdrop-blur-sm overflow-hidden">
      <div className="container mx-auto px-6 mb-8 text-center">
            {/* Header removed as per request */}
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="animate-marquee whitespace-nowrap flex items-center">
          {partners.map((partner) => (
            <span key={partner} className="mx-12 text-2xl font-bold font-heading text-slate-300 hover:text-primary transition-colors cursor-default">
              {partner}
            </span>
          ))}
        </div>

        <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center">
          {partners.map((partner) => (
            <span key={`${partner}-duplicate`} className="mx-12 text-2xl font-bold font-heading text-slate-300 hover:text-primary transition-colors cursor-default">
              {partner}
            </span>
          ))}
        </div>
        
        {/* Fade Masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[var(--background)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[var(--background)] to-transparent" />
      </div>
    </section>
  );
}

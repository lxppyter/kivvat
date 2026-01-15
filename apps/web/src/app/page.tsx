import { LandingNavbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/landing/marquee";
import { ProblemSection } from "@/components/landing/problem";
import { SolutionSteps } from "@/components/landing/solution-steps";
import { Features } from "@/components/landing/features";
import { ComparisonTable } from "@/components/landing/comparison";
import { Pricing } from "@/components/landing/pricing";
import { CostCalculator } from "@/components/landing/cost-calculator";
import { FAQ } from "@/components/landing/faq";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-primary/20 selection:text-primary">
      <LandingNavbar />
      <Hero />
      <ProblemSection />
      <SolutionSteps />
      <Features />
      <ComparisonTable />
      <Pricing />
      <FAQ />
      <CostCalculator />
      <LandingFooter />
    </main>
  );
}

"use client";

import { useState } from "react";
import { offerDetails, pricingAndGuarantee, finalCta, storyAndAuthority } from "@/data/content";
import { NewsletterModal } from "@/components/NewsletterModal";
import {
  Navbar,
  HeroSection,
  FactsSection,
  AboutSection,
  OfferSection,
  FinalCtaSection,
  TestimonialsSection,
  Footer,
} from "../src/features/landing";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-[#f8faff] text-black font-sans selection:bg-[#cfd8ff]">
      <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 space-y-12 sm:space-y-16">
        <HeroSection />
        <FactsSection />
        <AboutSection data={storyAndAuthority} />
        <OfferSection offerDetails={offerDetails} pricingAndGuarantee={pricingAndGuarantee} />
        <TestimonialsSection />
        <FinalCtaSection data={finalCta} />
      </main>
      <Footer />
      <NewsletterModal />
    </div>
  );
}

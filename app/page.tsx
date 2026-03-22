"use client";

import { useState } from "react";
import { content } from "@/data/content";
import { NewsletterModal } from "@/components/NewsletterModal";
import {
  Navbar,
  HeroSection,
  FactsSection,
  AboutSection,
  OfferSection,
  ExtraInformations,
  FinalCtaSection,
  TestimonialsSection,
  Footer,
} from "../src/features/landing";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div id="top" className="min-h-screen bg-[#f8faff] text-black font-sans selection:bg-[#cfd8ff]">
      <Navbar data={content.navbar} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-8 space-y-12 sm:space-y-16">
        <HeroSection data={content.hero} />
        <FactsSection data={content.factsSection} />
        <AboutSection data={content.storyAndAuthority} />
        <OfferSection offerDetails={content.offerDetails} pricingAndGuarantee={content.pricingAndGuarantee} />
        <ExtraInformations columns={content.offerDetails.offerClosing} />
        <TestimonialsSection data={content.testimonials} />
        <FinalCtaSection data={content.finalCta} />
      </main>
      <Footer data={content.footer} />
      <NewsletterModal data={content.newsletter} />
    </div>
  );
}

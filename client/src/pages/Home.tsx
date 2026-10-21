/* ==========================================================================
   HOME PAGE — CPZ Fitness (new ICA rebrand)
   Assembles all sections in conversion-optimized order
   ========================================================================== */

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsBar from "@/components/StatsBar";
import ForSection from "@/components/ForSection";
import AboutSection from "@/components/AboutSection";
import ProcessSection from "@/components/ProcessSection";
// import TestimonialsSection from "@/components/TestimonialsSection"; // hidden until real testimonials are ready
import BookSection from "@/components/BookSection";
import Footer from "@/components/Footer";

export default function Home() {
  // Arriving from another page (e.g. /tdee → /#about): the browser tries to jump
  // before React has rendered the section, so scroll once we've mounted
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  return (
    <div style={{ backgroundColor: "#121316", minHeight: "100vh" }}>
      <Navbar />
      <HeroSection />
      <StatsBar />
      <ForSection />
      <AboutSection />
      <ProcessSection />
      {/* <TestimonialsSection /> — hidden until real client testimonials are available */}
      <BookSection />
      <Footer />
    </div>
  );
}

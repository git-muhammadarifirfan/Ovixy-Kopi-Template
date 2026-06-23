import SmoothScrolling from "@/components/SmoothScrolling";
import Navbar from "@/components/Navbar";
import SequenceScroll from "@/components/SequenceScroll";
import AboutSection from "@/components/AboutSection";
import BentoSection from "@/components/BentoSection";
import TestimonialSection from "@/components/TestimonialSection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <SmoothScrolling>
      <main className="bg-[#27190e] min-h-screen">
        <Navbar />
        <SequenceScroll />
        <AboutSection />
        <BentoSection />
        <TestimonialSection />
        <CtaSection />
        <Footer />
      </main>
    </SmoothScrolling>
  );
}

import HeroSection from "./components/home/HeroSection";
import BrandStory from "./components/home/BrandStory";
import CategoryGrid from "./components/home/CategoryGrid";
import Testimonials from "./components/home/Testimonials";
import EbookPromoModal from "./components/EbookPromoModal";

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full bg-earth-silk">
      {/* 1. Immersive Video Hero */}
      <HeroSection />

      {/* 2. Complex Two-Column Editorial Layout */}
      <BrandStory />

      {/* 3. Edge-to-Edge Problem-Solver Grid */}
      <CategoryGrid /> 

      {/* 4. Full-Screen Video Testimonial */}
      <Testimonials />

      {/* 5. Invisible 10-Second Lead Magnet Timer */}
      <EbookPromoModal />
    </main>
  );
}

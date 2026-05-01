import HeroSection from "./components/home/HeroSection";
import BrandStory from "./components/home/BrandStory";
import CategoryGrid from "./components/home/CategoryGrid";
import Testimonials from "./components/home/Testimonials";
import AudioTestimonial from "./components/AudioTestimonial"; 
import AudioNotification from "./components/AudioNotification"; 

// REMOVED EbookPromoModal import!

export default function Home() {
  return (
    <main className="flex flex-col items-center w-full bg-earth-silk relative">
      
      <AudioNotification />

      <HeroSection />

      <BrandStory />

      <CategoryGrid /> 

      <section id="patient-audio" className="w-full py-20 px-6 bg-clinical-white border-y border-botanical-green/5">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center text-center">
          <h2 className="font-serif text-3xl md:text-4xl text-botanical-green mb-2">
            Listen to Our Patients
          </h2>
          <p className="text-sm text-botanical-green/60 mb-10 max-w-lg">
            Real stories and unedited voice notes from our community.
          </p>
          
          <AudioTestimonial />
        </div>
      </section>

      <Testimonials />

      {/* REMOVED <EbookPromoModal /> FROM HERE */}
    </main>
  );
}

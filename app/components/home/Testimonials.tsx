"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

// Real Customer Reviews extracted from WhatsApp Feedback
const reviews = [
  {
    id: 1,
    quote: "Thank you so much for the guidance and the natural remedies. The raisins are incredibly effective for memory support and brain health!",
    author: "Ayinde",
  },
  {
    id: 2,
    quote: "The products are so wonderful I made sure to leave a 5-star Google review. Alhamdulillah, I am so happy with the results.",
    author: "Ummu Anas",
  },
  {
    id: 3,
    quote: "I am missing your products all the way over here in Malawi, especially the pure camel milk! We really need an agent here.",
    author: "International Client (Malawi)",
  }
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-play timer for the mobile slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    }, 6000); // Changes every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[80vh] min-h-[600px] max-h-[800px] flex items-center justify-center overflow-hidden">

      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/testimony-bg.mp4" type="video/mp4" />
      </video>

      {/* Deep Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-botanical-green/95 via-botanical-green/80 to-botanical-green/40 z-10" />

      {/* Content Container */}
      <div className="relative z-20 w-full max-w-[1400px] mx-auto px-6 sm:px-12 flex flex-col items-center text-center">

        <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-clinical-white/60 mb-12 lg:mb-20">
          Stories of Healing
        </p>

        {/* ========================================= */}
        {/* MOBILE & TABLET VIEW: The Slideshow       */}
        {/* ========================================= */}
        <div className="w-full flex flex-col items-center lg:hidden">
          <div className="relative w-full max-w-2xl h-[250px] sm:h-[200px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="absolute w-full flex flex-col items-center"
              >
                <div className="flex justify-center gap-1 sm:gap-2 mb-6 sm:mb-8 text-clinical-white/90">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={18} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                <p className="text-2xl sm:text-4xl text-clinical-white italic font-serif leading-[1.3] mb-8">
                  "{reviews[currentIndex].quote}"
                </p>

                <div className="flex flex-col items-center">
                  <div className="w-12 h-[1px] bg-clinical-white/30 mb-4 sm:mb-6" />
                  <p className="text-clinical-white font-sans text-base sm:text-lg tracking-wide">
                    {reviews[currentIndex].author}
                  </p>
                  <p className="text-clinical-white/50 text-xs sm:text-sm mt-1 uppercase tracking-widest">
                    Verified WhatsApp Review
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slideshow Dots */}
          <div className="flex gap-3 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "w-8 bg-clinical-white" : "w-2 bg-clinical-white/30 hover:bg-clinical-white/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ========================================= */}
        {/* DESKTOP VIEW: The Editorial Grid          */}
        {/* ========================================= */}
        <div className="hidden lg:grid grid-cols-3 gap-16 w-full">
          {reviews.map((review) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              key={review.id} 
              className="flex flex-col items-center text-center"
            >
              <div className="flex justify-center gap-1.5 mb-8 text-clinical-white/90">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>

              {/* Smaller, elegant text size for desktop grid */}
              <p className="text-2xl xl:text-3xl text-clinical-white italic font-serif leading-relaxed mb-10">
                "{review.quote}"
              </p>

              <div className="flex flex-col items-center mt-auto">
                <div className="w-8 h-[1px] bg-clinical-white/30 mb-5" />
                <p className="text-clinical-white font-sans text-sm tracking-widest uppercase font-semibold">
                  {review.author}
                </p>
                <p className="text-clinical-white/40 text-xs mt-1.5 uppercase tracking-widest">
                  Verified WhatsApp Review
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link"; 

// --- THE VIDEO PLAYLIST ---
const PRODUCT_VIDEOS = [
  "/camel.mp4",
  "/honey.mp4",
  "/camel-raw.mp4",
  "/camel-milk.mp4"
];

export default function ProductVideoShowcase() {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  // We use a ref array to control all videos directly
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Moves to the next video in the array, loops back to 0 at the end
  const handleVideoEnd = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % PRODUCT_VIDEOS.length);
  };

  // Smart Playback Control: Only play the active video, pause the rest
  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      
      if (index === currentVideoIndex) {
        video.currentTime = 0; // Start from the beginning
        video.play().catch(e => console.log("Autoplay blocked:", e));
      } else {
        video.pause();
      }
    });
  }, [currentVideoIndex]);

  return (
    <section className="w-full bg-earth-silk py-20 px-6 sm:px-12 flex flex-col items-center">
      <div className="max-w-[1200px] w-full flex flex-col items-center text-center">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-botanical-green/60 mb-4">
            The Complete Collection
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif text-botanical-green leading-tight mb-6 capitalize">
            Natural Cure Herbal Medicine
          </h2>
          <p className="text-botanical-green/80 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Every remedy, from our wild honey to our pure camel milk, is hand-formulated with ancestral wisdom and clinical precision. Witness the purity of our entire botanical range.
          </p>
        </motion.div>

        {/* Video Player Wrapper - All videos stack inside here */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative w-full h-[500px] md:h-[650px] lg:h-[750px] rounded-sm overflow-hidden shadow-xl border border-botanical-green/10 bg-botanical-green mb-12 group"
        >
          {/* We render ALL videos, but only show the active one via CSS opacity */}
          {PRODUCT_VIDEOS.map((src, index) => (
            <video 
              key={src}
              ref={(el) => { videoRefs.current[index] = el; }}
              src={src}
              muted 
              playsInline
              preload="auto" 
              onEnded={handleVideoEnd}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                index === currentVideoIndex ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            />
          ))}

          {/* Subtle Inner Shadow for Luxury Feel */}
          <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.1)] pointer-events-none z-20" />

          {/* Slideshow Indicators (Dots) */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-30">
            {PRODUCT_VIDEOS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideoIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                  index === currentVideoIndex 
                    ? "w-8 bg-clinical-white" 
                    : "w-2 bg-clinical-white/40 hover:bg-clinical-white/80"
                }`}
                aria-label={`Skip to video ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link 
            href="/shop"
            className="flex items-center gap-3 px-8 py-4 bg-botanical-green text-clinical-white text-xs font-bold uppercase tracking-[0.2em] rounded-full hover:bg-botanical-green/90 transition-all group"
          >
            Explore All Products
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

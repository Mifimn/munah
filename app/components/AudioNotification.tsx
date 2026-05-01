"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, X } from "lucide-react";

export default function AudioNotification() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // NO TIMER! It instantly sets to true as soon as the site loads.
    setIsVisible(true);
  }, []);

  const scrollToAudio = () => {
    const section = document.getElementById("patient-audio");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsVisible(false); 
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 right-6 z-[300] flex items-center bg-clinical-white border border-botanical-green/20 shadow-2xl rounded-full p-2 pr-4"
        >
          <div 
            onClick={scrollToAudio}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 bg-botanical-green text-clinical-white rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <Volume2 size={18} className="animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-botanical-green font-bold">Audio Reviews</p>
              <p className="text-[11px] text-botanical-green/60 font-serif">Real patient voice notes</p>
            </div>
          </div>

          <button 
            onClick={(e) => {
              e.stopPropagation(); 
              setIsVisible(false);
            }} 
            className="ml-4 p-1.5 text-botanical-green/40 hover:bg-botanical-green/10 hover:text-botanical-green rounded-full transition-colors"
            title="Dismiss"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

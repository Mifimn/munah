"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConsultationToggle() {
  const [isVisible, setIsVisible] = useState(false);
  const WHATSAPP_NUMBER = "1234567890"; // Replace with your actual number

  useEffect(() => {
    const handleScroll = () => {
      // Show button only after scrolling 500px
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[90]"
        >
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=I%20am%20seeking%20a%20clinical%20consultation%20regarding%20botanical%20remedies.`}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-botanical-green text-clinical-white rounded-full shadow-2xl hover:bg-botanical-green/90 transition-all active:scale-90"
          >
            {/* Smart Tooltip */}
            <div className="absolute right-full mr-4 px-5 py-2 bg-clinical-white border border-botanical-green/10 rounded-full opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap shadow-xl hidden md:block">
              <span className="text-botanical-green text-[10px] font-bold uppercase tracking-[0.2em]">
                Direct Consultation
              </span>
            </div>

            <MessageCircle size={24} className="group-hover:rotate-12 transition-transform" />
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

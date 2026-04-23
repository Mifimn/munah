"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, MessageCircleHeart } from "lucide-react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user already closed the ad during this session
    const isClosed = sessionStorage.getItem("whatsappPromoClosed");
    
    // If they haven't closed it, show it after 5 seconds
    if (!isClosed) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000); 

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Save to session storage so it doesn't annoy them on every page click
    sessionStorage.setItem("whatsappPromoClosed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }} 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-botanical-green/60 backdrop-blur-sm"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }} 
            animate={{ scale: 1, y: 0 }} 
            exit={{ scale: 0.95, y: 20 }} 
            className="bg-earth-silk border border-botanical-green/20 p-8 md:p-10 max-w-md w-full relative shadow-2xl rounded-sm overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-botanical-green/40 hover:text-botanical-green transition-colors"
            >
              <X size={24} />
            </button>

            {/* Background Decorative Icon */}
            <div className="absolute -top-10 -right-10 text-botanical-green/5">
              <MessageCircleHeart size={150} strokeWidth={1} />
            </div>

            <div className="relative z-10 text-center">
              <span className="text-[10px] font-bold uppercase tracking-widest text-botanical-green/50 mb-4 block">
                Exclusive Invitation
              </span>
              
              <h2 className="font-serif text-3xl text-botanical-green mb-4 leading-tight">
                The Apothecary Community
              </h2>
              
              <p className="text-sm text-botanical-green/70 mb-8 leading-relaxed">
                Unlock exclusive healing recipes and daily ancestral food remedies. Join our private circle to get direct botanical wisdom from Modina Olagunju.
              </p>

              <a 
                href="https://chat.whatsapp.com/L6J7JfIVSqn4Yo3dlZSiO4?mode=gi_t" 
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleClose} // Closes modal when they click the link
                className="w-full flex justify-center items-center gap-3 bg-botanical-green text-clinical-white py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-botanical-green/90 transition-all active:scale-[0.98]"
              >
                Join WhatsApp Circle <ArrowRight size={16} />
              </a>
              
              <button 
                onClick={handleClose}
                className="mt-6 text-[10px] uppercase tracking-widest text-botanical-green/40 hover:text-botanical-green transition-colors font-bold"
              >
                No thanks, I'll explore later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

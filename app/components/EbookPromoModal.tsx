"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function EbookPromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const checkEligibility = async () => {
      // 1. Are they already logged in?
      // (We still want to hide it if they are already a registered member!)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) return; 

      // 2. Start the 5-second timer
      timer = setTimeout(() => {
        setIsOpen(true);
      }, 5000); 
    };

    checkEligibility();

    // Cleanup the timer if they leave the page before 5 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // I REMOVED the localStorage rule here! 
    // Now it will completely forget they closed it.
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Blurred Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-botanical-green/40 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-3xl bg-clinical-white shadow-2xl flex flex-col md:flex-row overflow-hidden"
          >
            {/* Close Button */}
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 bg-clinical-white/50 hover:bg-botanical-green/10 rounded-full text-botanical-green transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left Side: Aesthetic Graphic */}
            <div className="md:w-2/5 bg-botanical-green p-8 flex flex-col justify-center items-center text-clinical-white relative overflow-hidden hidden md:flex">
              <Leaf className="absolute -top-10 -left-10 w-48 h-48 opacity-[0.03] rotate-45" />
              <BookOpen size={48} className="mb-6 opacity-80" />
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60 text-center">
                Exclusive Archives
              </p>
            </div>

            {/* Right Side: Copy & Call to Action */}
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-4 md:hidden">
                <BookOpen size={16} className="text-botanical-green/50" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-botanical-green/50 font-bold">
                  Exclusive Archives
                </span>
              </div>
              
              <h2 className="font-serif text-3xl md:text-4xl text-botanical-green mb-4 leading-tight">
                Unlock the Healing Guide.
              </h2>
              
              <p className="text-sm text-botanical-green/70 mb-8 leading-relaxed font-light">
                Register for the Natural Cure Apothecary today and instantly receive our exclusive, hand-curated eBook: <strong className="font-serif italic text-botanical-green">How to Use Black Seed Oil to Heal 10 Ailments</strong>.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center mt-auto">
                <Link 
                  href="/account" 
                  onClick={handleClose} 
                  className="w-full sm:w-auto bg-botanical-green text-clinical-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl hover:bg-botanical-green/90 transition-all"
                >
                  Claim Free eBook <ArrowRight size={14} />
                </Link>
                <button 
                  onClick={handleClose}
                  className="text-[10px] uppercase tracking-widest text-botanical-green/40 hover:text-botanical-green font-bold transition-colors"
                >
                  No thanks, I'll browse
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

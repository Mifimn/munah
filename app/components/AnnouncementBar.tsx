"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, MessageCircleHeart } from "lucide-react";
import { supabase } from "@/lib/supabase"; 

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    console.log("🟢 WhatsApp Modal Mounted: Checking rules...");

    // 🚨 TEMPORARILY DISABLED FOR TESTING:
    // const isClosed = sessionStorage.getItem("whatsappPromoClosed");
    // if (isClosed) {
    //   console.log("🛑 Browser says you already closed this! Aborting.");
    //   return; 
    // }

    // 1. Listen for the eBook modal closing signal
    const triggerWhatsAppModal = () => {
      console.log("👂 Heard the eBook modal close! Opening WhatsApp modal...");
      setIsVisible(true);
    };
    window.addEventListener("ebookModalClosed", triggerWhatsAppModal);

    // 2. Check if they are ALREADY logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        console.log("👤 User is logged in! Opening WhatsApp modal instantly...");
        setIsVisible(true);
      } else {
        console.log("👻 User is a guest. Waiting for eBook modal to finish...");
      }
    };
    checkUser();

    // 3. Listen for login events
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log("🔐 Just logged in! Opening WhatsApp modal...");
        setIsVisible(true);
      }
    });

    return () => {
      window.removeEventListener("ebookModalClosed", triggerWhatsAppModal);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleClose = () => {
    console.log("❌ Closing WhatsApp Modal.");
    setIsVisible(false);
    // 🚨 TEMPORARILY DISABLED FOR TESTING:
    // sessionStorage.setItem("whatsappPromoClosed", "true");
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
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 text-botanical-green/40 hover:text-botanical-green transition-colors"
            >
              <X size={24} />
            </button>

            <div className="absolute -top-10 -right-10 text-botanical-green/5 z-0">
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
                onClick={handleClose} 
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

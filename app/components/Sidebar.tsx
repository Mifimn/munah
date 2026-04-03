"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Logic for fading in the logo after Hero scroll
      setShowBrand(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Removed "Consult" from the menu items
  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Archive", href: "/shop" },
    { name: "Library", href: "/library" },
    { name: "Account", href: "/account" },
  ];

  return (
    <>
      {/* --- TOP GLOBAL NAVIGATION --- */}
      <div className="fixed top-0 left-0 z-50 w-full pointer-events-none">
        <div className="max-w-[1600px] mx-auto px-6 py-8 sm:py-12 flex justify-between items-center">

          {/* LOGO ONLY (Fades in on scroll) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showBrand ? 1 : 0, scale: showBrand ? 1 : 0.8 }}
            className="pointer-events-auto"
          >
            <Link href="/" className="group flex items-center justify-center bg-botanical-green/10 backdrop-blur-md p-3 rounded-full border border-botanical-green/20 hover:bg-botanical-green transition-all duration-500">
              <Leaf size={20} className="text-botanical-green group-hover:text-clinical-white transition-colors" />
            </Link>
          </motion.div>

          {/* PC INDEX & MOBILE TOGGLE */}
          <div className="flex items-center gap-4 pointer-events-auto">
            {/* PC Structured Index (Now 4 items) */}
            <nav className="hidden lg:flex items-center border border-clinical-white/20 bg-botanical-green/10 backdrop-blur-md rounded-full overflow-hidden">
              {menuItems.map((item, index) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`px-6 py-3 text-[10px] uppercase tracking-[0.3em] transition-all
                    ${pathname === item.href ? "text-clinical-white bg-botanical-green/20 font-bold" : "text-clinical-white/60 hover:text-clinical-white"}
                    ${index !== menuItems.length - 1 ? "border-r border-clinical-white/10" : ""}
                  `}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* MOBILE TOGGLE (Pure Icon) */}
            <button 
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-4 bg-botanical-green text-clinical-white rounded-full shadow-2xl active:scale-90 transition-transform"
            >
              <Menu size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>

      {/* --- SMART MOBILE SIDEBAR --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-botanical-green flex flex-col overflow-hidden"
          >
            {/* Sidebar Top Header */}
            <div className="flex justify-between items-center px-8 py-10 border-b border-clinical-white/10">
              <div className="flex items-center gap-2 opacity-40">
                <Leaf size={14} className="text-clinical-white" />
                <span className="text-[10px] uppercase tracking-widest text-clinical-white font-bold">Ledger Index</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-4 bg-clinical-white/10 rounded-full text-clinical-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Sidebar Navigation (Now 4 items) */}
            <nav className="flex-1 flex flex-col justify-center px-8">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                  className="border-b border-clinical-white/5 py-6"
                >
                  <Link 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group flex items-center justify-between"
                  >
                    <div className="flex items-baseline gap-4">
                      <span className="text-clinical-white/20 font-serif italic text-lg">0{index + 1}</span>
                      <span className={`text-5xl font-serif tracking-tighter transition-all ${
                        pathname === item.href ? "text-clinical-white italic" : "text-clinical-white/50 group-hover:text-clinical-white"
                      }`}>
                        {item.name}
                      </span>
                    </div>
                    <ArrowRight className="text-clinical-white opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0" />
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-8 border-t border-clinical-white/10 grid grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-clinical-white/30 mb-2">Apothecary</p>
                <p className="text-xs text-clinical-white/70 font-serif lowercase tracking-widest">naturalcareherbalmedicine.com</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-clinical-white/30 mb-2">Ethics</p>
                <p className="text-xs text-clinical-white/70 italic">Clinical Purity.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

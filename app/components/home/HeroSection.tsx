"use client";

import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative w-full h-screen lg:h-[85vh] max-h-[900px] flex flex-col items-center overflow-hidden">

      {/* 1. TOP-LEFT BRAND IDENTITY (Replaces Navbar) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-0 left-0 z-30 pt-8 sm:pt-12 px-6 sm:px-12 w-full flex justify-start"
      >
        <Link href="/" className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-clinical-white/10 backdrop-blur-md p-2 rounded-full border border-clinical-white/20 group-hover:bg-clinical-white/20 transition-all duration-500">
            <Leaf size={18} className="text-clinical-white" />
          </div>
          <span className="font-serif text-base sm:text-lg tracking-widest text-clinical-white lowercase opacity-80 group-hover:opacity-100 transition-opacity">
            naturalcureherbalmedicine
          </span>
        </Link>
      </motion.div>

      {/* Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Complex Overlay */}
      <div className="absolute inset-0 bg-botanical-green/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-botanical-green/10 to-[var(--color-earth-silk)] z-10" />

      {/* Hero Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
        className="relative z-20 text-center max-w-4xl flex-1 flex flex-col justify-center px-6 mt-16 lg:mt-0"
      >
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.4em] text-clinical-white/70 mb-6"
        >
          Absolute Potency • Clinical Purity
        </motion.p>

        <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl mb-8 tracking-tight text-clinical-white leading-[1.1]">
          Nature's <br className="sm:hidden" />
          <span className="italic font-light opacity-90 text-clinical-white/80">Apothecary</span>
        </h1>

        <p className="font-sans text-lg sm:text-xl lg:text-2xl text-clinical-white/80 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
          Clinically-backed botanical remedies designed to target the root cause. Discover absolute healing.
        </p>

        <Link href="/shop" passHref>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group relative inline-flex items-center justify-center gap-4 px-10 py-5 bg-clinical-white text-botanical-green rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest overflow-hidden transition-all duration-500 shadow-2xl"
          >
            <span className="relative z-10">Explore the Archive</span>
            <ArrowRight size={18} className="relative z-10 transition-transform duration-500 group-hover:translate-x-1" />
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
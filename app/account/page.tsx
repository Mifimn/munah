"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ArrowRight, Lock, Mail, User } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen bg-earth-silk flex items-center justify-center p-4 sm:p-6 pt-32 pb-20">
      <div className="w-full max-w-[1100px] bg-botanical-green grid grid-cols-1 lg:grid-cols-2 rounded-sm overflow-hidden shadow-2xl relative">

        {/* --- LEFT SIDE: CINEMATIC VIDEO BRANDING --- */}
        {/* We changed bg-botanical-green/50 to bg-black to make the video stand out */}
        <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden bg-black">

          {/* Background Video Layer */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              className="w-full h-full object-cover opacity-100" // Set opacity to 100% to test visibility
            >
              <source src="/auth-bg-video.mp4" type="video/mp4" />
            </video>

            {/* Dark tint so text is readable, but video is visible */}
            <div className="absolute inset-0 bg-black/40 z-10" />
          </div>

          {/* Branding Content - Added z-20 to stay on top of video */}
          <div className="relative z-20">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <Leaf size={32} className="text-clinical-white mb-8" />
            </motion.div>
            <h2 className="font-serif text-5xl text-clinical-white leading-tight">
              Access the <br /> <span className="italic opacity-70 font-light">Clinical Archives</span>
            </h2>
          </div>

          <div className="relative z-20 flex flex-col gap-4">
            <div className="w-12 h-[1px] bg-clinical-white/20" />
            <p className="text-clinical-white/40 text-[10px] tracking-[0.4em] uppercase">
              Authenticated Patient Access Only
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE SECURE FORM --- */}
        <div className="bg-clinical-white p-8 sm:p-16 lg:p-20 flex flex-col justify-center relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 bg-botanical-green rounded-full animate-pulse" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-botanical-green/40">
                  Secure Portal
                </p>
              </div>

              <h1 className="font-serif text-4xl text-botanical-green mb-10 tracking-tight">
                {isLogin ? "Open Ledger" : "Create Profile"}
              </h1>

              <div className="space-y-8">
                {!isLogin && (
                  <div className="border-b border-botanical-green/10 flex items-center gap-4 py-3 focus-within:border-botanical-green transition-colors">
                    <User size={18} className="text-botanical-green/20" />
                    <input type="text" placeholder="Full Name" className="bg-transparent w-full outline-none text-botanical-green font-sans" />
                  </div>
                )}
                <div className="border-b border-botanical-green/10 flex items-center gap-4 py-3 focus-within:border-botanical-green transition-colors">
                  <Mail size={18} className="text-botanical-green/20" />
                  <input type="email" placeholder="Email Address" className="bg-transparent w-full outline-none text-botanical-green font-sans" />
                </div>
                <div className="border-b border-botanical-green/10 flex items-center gap-4 py-3 focus-within:border-botanical-green transition-colors">
                  <Lock size={18} className="text-botanical-green/20" />
                  <input type="password" placeholder="Secure Password" className="bg-transparent w-full outline-none text-botanical-green font-sans" />
                </div>
              </div>

              <button className="w-full mt-12 bg-botanical-green text-clinical-white py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-botanical-green/90 transition-all shadow-xl active:scale-[0.98]">
                {isLogin ? "Unlock Archives" : "Initialize Identity"} <ArrowRight size={16} />
              </button>

              <div className="mt-10 flex flex-col items-center gap-4 text-center">
                <p className="text-[11px] text-botanical-green/50 tracking-wide">
                  {isLogin ? "New to the apothecary?" : "Already hold a ledger?"}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-botanical-green font-bold hover:underline underline-offset-4"
                  >
                    {isLogin ? "Register Here" : "Sign In"}
                  </button>
                </p>
                <Link href="/" className="text-[9px] uppercase tracking-[0.2em] text-botanical-green/30 hover:text-botanical-green transition-colors mt-2">
                  Return to Home
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

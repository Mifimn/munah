"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, ArrowRight, Lock, Mail, User, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Live DB connection

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // --- FORM STATE ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // --- REAL AUTHENTICATION HANDLER ---
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      if (isLogin) {
        // 1. LOGIN LOGIC
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        
        // Success! Redirect to ledger
        router.push("/account/ledger");
      } else {
        // 2. SIGNUP LOGIC (Testing Mode: No Email Confirmation)
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName } // Passes name to your SQL trigger
          }
        });
        if (signUpError) throw signUpError;
        
        // Success! Because email confirmation is OFF in Supabase, 
        // the user is instantly logged in. Redirect to ledger.
        router.push("/account/ledger"); 
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-botanical-green">
      
      {/* 1. LIGHT GRADIENT VIDEO BACKGROUND (Library Style) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover opacity-50"
        >
          <source src="/auth-bg-video.mp4" type="video/mp4" />
        </video>
        
        {/* Soft, light green gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-botanical-green/40 via-botanical-green/10 to-botanical-green/30 backdrop-blur-[2px]" />
      </div>

      {/* 2. AUTH CARD - Compact Height & Refined Padding */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[1000px] bg-botanical-green/10 backdrop-blur-2xl grid grid-cols-1 lg:grid-cols-2 rounded-sm overflow-hidden border border-clinical-white/10 shadow-2xl"
      >

        {/* --- LEFT SIDE: BRANDING (Hidden on Mobile) --- */}
        <div className="hidden lg:flex flex-col justify-between p-12 border-r border-clinical-white/5 bg-black/10">
          <div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <Leaf size={28} className="text-clinical-white mb-6 opacity-80" />
            </motion.div>
            <h2 className="font-serif text-4xl text-clinical-white leading-tight">
              Access the <br /> 
              <span className="italic opacity-60 font-light text-3xl">Clinical Archives</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            <div className="w-8 h-[1px] bg-clinical-white/20" />
            <p className="text-[9px] tracking-[0.4em] uppercase text-clinical-white/30 font-bold">
              Secure Ledger Access
            </p>
          </div>
        </div>

        {/* --- RIGHT SIDE: THE COMPACT FORM --- */}
        <div className="bg-clinical-white p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-1 bg-botanical-green rounded-full animate-pulse" />
                <p className="text-[9px] uppercase tracking-[0.3em] text-botanical-green/40 font-bold">
                  Authentication Portal
                </p>
              </div>

              <h1 className="font-serif text-3xl text-botanical-green mb-6 tracking-tight">
                {isLogin ? "Open Ledger" : "Create Profile"}
              </h1>

              {/* Dynamic Error Message */}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 text-red-800 text-xs p-3 mb-6 rounded-sm font-bold tracking-widest uppercase border border-red-100 flex items-center gap-2">
                  <AlertCircle size={14} /> {error}
                </motion.div>
              )}

              <form onSubmit={handleAuth} className="space-y-6">
                {!isLogin && (
                  <div className="border-b border-botanical-green/10 flex items-center gap-4 py-2 focus-within:border-botanical-green transition-colors">
                    <User size={16} className="text-botanical-green/30" />
                    <input 
                      required 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name" 
                      className="bg-transparent w-full outline-none text-botanical-green text-sm font-sans placeholder:text-botanical-green/20" 
                    />
                  </div>
                )}
                <div className="border-b border-botanical-green/10 flex items-center gap-4 py-2 focus-within:border-botanical-green transition-colors">
                  <Mail size={16} className="text-botanical-green/30" />
                  <input 
                    required 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address" 
                    className="bg-transparent w-full outline-none text-botanical-green text-sm font-sans placeholder:text-botanical-green/20" 
                  />
                </div>
                <div className="border-b border-botanical-green/10 flex items-center gap-4 py-2 focus-within:border-botanical-green transition-colors">
                  <Lock size={16} className="text-botanical-green/30" />
                  <input 
                    required 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password" 
                    className="bg-transparent w-full outline-none text-botanical-green text-sm font-sans placeholder:text-botanical-green/20" 
                  />
                </div>

                <button 
                  disabled={isLoading}
                  className="w-full mt-4 bg-botanical-green text-clinical-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-botanical-green/90 transition-all shadow-lg disabled:opacity-50 active:scale-[0.98]"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" size={16} />
                  ) : (
                    <>{isLogin ? "Unlock Archives" : "Initialize Identity"} <ArrowRight size={14} /></>
                  )}
                </button>
              </form>

              <div className="mt-8 flex flex-col items-center gap-4 text-center">
                <p className="text-[10px] text-botanical-green/50 tracking-wide">
                  {isLogin ? "New to the apothecary?" : "Already hold a ledger?"}
                  <button 
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError(""); // Clear errors when switching tabs
                    }}
                    className="ml-2 text-botanical-green font-bold hover:underline underline-offset-4"
                  >
                    {isLogin ? "Register" : "Sign In"}
                  </button>
                </p>
                <Link 
                  href="/" 
                  className="text-[8px] uppercase tracking-[0.2em] text-botanical-green/30 hover:text-botanical-green transition-colors"
                >
                  Return to Home
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}

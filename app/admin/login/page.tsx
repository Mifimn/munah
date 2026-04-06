"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, ArrowRight, Leaf, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Live DB connection

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // 1. Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setIsLoading(false);
      return;
    }

    // 2. Verify Admin Clearance in the profiles table
    if (authData.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', authData.user.id)
        .single();

      if (profile?.is_admin) {
        // Success! Redirect to the Command Center
        router.push("/admin");
      } else {
        // Not an admin: Sign them out and show error
        await supabase.auth.signOut();
        setError("Clinical clearance required. Access Denied.");
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="min-h-screen bg-botanical-green flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Graphic */}
      <Leaf className="absolute -top-20 -left-20 w-[600px] h-[600px] text-clinical-white opacity-[0.02] rotate-45 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Terminal Header */}
        <div className="flex flex-col items-center mb-10 text-clinical-white">
          <div className="w-16 h-16 bg-clinical-white/10 rounded-full flex items-center justify-center mb-6 border border-clinical-white/20">
            <ShieldCheck size={28} className="text-clinical-white" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-clinical-white/50 font-bold mb-2">
            Secure Encrypted Terminal
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-clinical-white tracking-tighter">
            Apothecary Access
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-clinical-white p-8 md:p-10 shadow-2xl rounded-sm">
          
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 text-red-800 text-xs p-4 mb-6 rounded-sm font-bold tracking-widest uppercase border border-red-100 flex items-center gap-2">
              <Lock size={14} /> {error}
            </motion.div>
          )}

          <div className="space-y-6">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2 mb-2">
                <Mail size={12}/> Admin Email
              </label>
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="modina@naturalcure.com" 
                className="w-full border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green font-mono" 
              />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2 mb-2">
                <Lock size={12}/> Security Passcode
              </label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green bg-transparent text-lg text-botanical-green font-mono tracking-widest" 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-10 bg-botanical-green text-clinical-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-botanical-green/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? (
              <><Loader2 size={16} className="animate-spin" /> Authenticating...</>
            ) : (
              <>Initiate Override <ArrowRight size={14} /></>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-clinical-white/30">
            IP Logged: Restricted Access Only
          </p>
        </div>
      </motion.div>
    </main>
  );
}

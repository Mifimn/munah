"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Copy, Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const PRIZES = [
  { label: "5% OFF", color: "#FFFFFF", code: "HEAL5" },
  { label: "FREE SHIPPING", color: "#FDFCF9", code: "FREESHIP" },
  { label: "10% OFF", color: "#FFFFFF", code: "NATURAL10" },
  { label: "GIFT HONEY", color: "#FDFCF9", code: "PUREGIFT" },
  { label: "15% OFF", color: "#FFFFFF", code: "ROOTS15" },
  { label: "ANCIENT GUIDE", color: "#FDFCF9", code: "GUIDE2026" },
];

export default function PromoPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<{label: string, code: string} | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSpin = () => {
    if (isSpinning || result) return;
    setIsSpinning(true);

    const extraDegree = Math.floor(Math.random() * 360);
    const totalRotation = rotation + 2880 + extraDegree; 
    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      const normalizedDegree = (360 - (totalRotation % 360)) % 360;
      const prizeIndex = Math.floor(normalizedDegree / 60);
      setResult(PRIZES[prizeIndex]);
    }, 4000);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-earth-silk flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Branding Header */}
      <div className="text-center mb-12">
        <Zap size={24} className="text-botanical-green/30 mx-auto mb-6" />
        <h1 className="font-serif text-4xl md:text-5xl text-botanical-green mb-4">The Healing Circle</h1>
        <p className="text-[10px] uppercase tracking-[0.4em] text-botanical-green/50 font-bold">Exclusive Apothecary Rewards</p>
      </div>

      {/* WHEEL ASSEMBLY */}
      <div className="relative w-80 h-80 md:w-[400px] md:h-[400px] mx-auto mb-16">
        
        {/* Precision Pointer */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-30">
          <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-botanical-green drop-shadow-md" />
        </div>

        {/* The Spinning Disk */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.2, 0, 0, 1] }}
          className="w-full h-full rounded-full border-[12px] border-clinical-white shadow-2xl relative overflow-hidden bg-clinical-white"
        >
          {PRIZES.map((prize, i) => (
            <div 
              key={i}
              className="absolute top-0 left-0 w-full h-full origin-center"
              style={{ transform: `rotate(${i * 60}deg)` }}
            >
              {/* Perfectly Aligned Slices */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 origin-bottom"
                style={{ 
                  background: prize.color,
                  clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                  width: '116%' 
                }} 
              />
              
              {/* Aligned Text Label */}
              <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-full text-center pointer-events-none">
                 <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] text-botanical-green/60 uppercase">
                  {prize.label}
                 </span>
              </div>
            </div>
          ))}

          {/* Glass Center Hub */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-16 h-16 bg-white/60 backdrop-blur-xl rounded-full border border-botanical-green/10 shadow-lg flex items-center justify-center">
               <div className="w-3 h-3 bg-botanical-green/20 rounded-full animate-pulse" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Card */}
      <div className="w-full max-w-md bg-clinical-white p-8 border border-botanical-green/5 shadow-sm text-center">
        {!result ? (
          <div className="space-y-6">
            <p className="text-sm text-botanical-green/60 leading-relaxed italic font-light">
              "Every spin is a gift from the earth. Claim what the ancestors have reserved for you today."
            </p>
            <button 
              onClick={handleSpin}
              disabled={isSpinning}
              className={`w-full py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-500
                ${isSpinning 
                  ? 'bg-botanical-green/10 text-botanical-green/30 cursor-not-allowed' 
                  : 'bg-botanical-green text-clinical-white shadow-xl hover:translate-y-[-2px] active:scale-[0.98]'
                }
              `}
            >
              {isSpinning ? "Revealing your fate..." : "Spin the Circle"}
            </button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-[10px] uppercase tracking-widest text-botanical-green/40 font-bold mb-3">Your Reward is Ready</p>
            <h3 className="font-serif text-4xl text-botanical-green mb-6 flex items-center justify-center gap-3">
              <Sparkles size={24} className="opacity-30" /> {result.label}
            </h3>
            
            {/* Coupon Code Box */}
            <div className="flex items-center justify-between bg-earth-silk border border-botanical-green/10 p-4 mb-8 rounded-sm">
              <span className="text-sm font-mono text-botanical-green font-bold tracking-widest uppercase">
                {result.code}
              </span>
              <button 
                onClick={() => copyToClipboard(result.code)}
                className="text-botanical-green/60 hover:text-botanical-green transition-colors"
              >
                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
              </button>
            </div>

            <Link 
              href="/shop"
              className="w-full flex justify-center items-center gap-3 bg-botanical-green text-clinical-white py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.3em] shadow-xl hover:bg-botanical-green/90 transition-all"
            >
              Redeem in Shop <ArrowRight size={14} />
            </Link>
          </motion.div>
        )}
      </div>

      {/* Minimal Footer */}
      <p className="mt-12 text-[9px] uppercase tracking-[0.2em] text-botanical-green/30">
        One spin per customer • Natural Cure Apothecary 2026
      </p>
    </div>
  );
}

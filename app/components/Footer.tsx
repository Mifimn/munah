"use client";

import { motion } from "framer-motion";
import { Leaf, MessageCircle, Phone, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-botanical-green text-clinical-white pt-24 pb-12 px-6 sm:px-12 border-t border-clinical-white/10">
      <div className="max-w-[1600px] mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

          {/* Column 1: Brand Signature */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <Leaf size={20} className="opacity-80" />
              <span className="font-serif text-lg tracking-widest lowercase opacity-90">
                naturalcureherbalmedicine
              </span>
            </div>
            <p className="font-sans text-xs text-clinical-white/50 leading-relaxed max-w-xs font-light">
              Bridging the gap between ancestral botanical wisdom and modern clinical protocols. 
            </p>
          </div>

          {/* Column 2: Consultation */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-clinical-white/30 mb-8 font-bold">Consultation</p>
            <ul className="space-y-6">
              <li>
                <a href="https://wa.me/2348146245326" className="group flex flex-col gap-1">
                  <span className="text-[10px] text-clinical-white/40 uppercase tracking-widest">WhatsApp (Primary)</span>
                  <span className="font-serif text-xl group-hover:italic">+234 814 624 5326</span>
                </a>
              </li>
              <li>
                <a href="tel:+2349055285064" className="group flex flex-col gap-1">
                  <span className="text-[10px] text-clinical-white/40 uppercase tracking-widest">Secondary Line</span>
                  <span className="font-serif text-xl">+234 905 528 5064</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-clinical-white/30 mb-8 font-bold">Quick Navigation</p>
            <ul className="space-y-4 font-serif text-lg">
              <li><Link href="/shop" className="hover:opacity-50 transition-opacity">The Shop Archive</Link></li>
              <li><Link href="/library" className="hover:opacity-50 transition-opacity">Wellness Library</Link></li>
              <li><Link href="/account" className="hover:opacity-50 transition-opacity">Patient Portal</Link></li>
            </ul>
          </div>

          {/* Column 4: Social Archives (Fixed Icons) */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-clinical-white/30 mb-8 font-bold">Social Archives</p>
            <div className="flex flex-col gap-6">

              {/* Manual Instagram SVG */}
              <a href="https://instagram.com/naturalcureherbalmedicine" target="_blank" className="flex items-center gap-4 group">
                <div className="p-3 border border-clinical-white/10 rounded-full group-hover:bg-clinical-white/10 transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </div>
                <span className="text-xs tracking-widest uppercase font-bold text-clinical-white/60 group-hover:text-clinical-white">Instagram</span>
              </a>

              {/* Manual TikTok SVG */}
              <a href="https://tiktok.com/@naturalcureherbalmedicin" target="_blank" className="flex items-center gap-4 group">
                <div className="p-3 border border-clinical-white/10 rounded-full group-hover:bg-clinical-white/10 transition-all">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
                  </svg>
                </div>
                <span className="text-xs tracking-widest uppercase font-bold text-clinical-white/60 group-hover:text-clinical-white">TikTok</span>
              </a>

            </div>
          </div>

        </div>

        {/* BOTTOM BAR */}
        <div className="pt-12 border-t border-clinical-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-clinical-white/30">
            © 2026 naturalcureherbalmedicine • Clinical Purity Guaranteed
          </p>
          <button onClick={scrollToTop} className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-clinical-white/50 hover:text-clinical-white transition-all group">
            Return to Top <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}

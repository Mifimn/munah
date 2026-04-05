"use client";

import { motion } from "framer-motion";
import { Leaf, ArrowUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hides the Footer completely on the Admin page
  if (pathname.startsWith("/admin")) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative z-50 w-full bg-botanical-green text-clinical-white pt-20 pb-10 px-6 sm:px-12 border-t border-clinical-white/10">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 mb-20">
          
          {/* Column 1: Brand Authority */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Leaf size={18} className="opacity-60" />
              <span className="font-serif text-lg tracking-widest lowercase">
                naturalcureherbalmedicine
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-clinical-white/40 max-w-xs font-light uppercase tracking-wider">
              Bridging ancestral botanical wisdom with modern clinical protocols. 
              Curated by <span className="text-clinical-white/70">Modina Olagunju</span>.
            </p>
          </div>

          {/* Column 2: Quick Index */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-clinical-white/20 mb-6 font-bold">Archives</p>
              <ul className="space-y-3 text-[13px] font-serif">
                <li><Link href="/shop" className="hover:opacity-50 transition-opacity">The Shop</Link></li>
                <li><Link href="/library" className="hover:opacity-50 transition-opacity">Library</Link></li>
                <li><Link href="/account" className="hover:opacity-50 transition-opacity">Portal</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-clinical-white/20 mb-6 font-bold">Socials</p>
              <ul className="space-y-3 text-[13px] font-serif">
                <li><a href="https://instagram.com/naturalcureherbalmedicine" target="_blank" className="hover:opacity-50 transition-opacity">Instagram</a></li>
                <li><a href="https://tiktok.com/@naturalcureherbalmedicin" target="_blank" className="hover:opacity-50 transition-opacity">TikTok</a></li>
              </ul>
            </div>
          </div>

          {/* Column 3: The Protocol (Single Contact) */}
          <div className="lg:text-right">
            <p className="text-[9px] uppercase tracking-[0.3em] text-clinical-white/20 mb-6 font-bold">Primary Consultation</p>
            <a href="https://wa.me/2348066004959" className="group inline-flex flex-col lg:items-end gap-1">
              <span className="font-serif text-2xl group-hover:italic transition-all tracking-tight">+234 806 600 4959</span>
              <span className="text-[9px] text-clinical-white/30 uppercase tracking-[0.2em]">Secure WhatsApp Line</span>
            </a>
          </div>

        </div>

        {/* BOTTOM BAR: Legal & Mifimn Credit */}
        <div className="pt-8 border-t border-clinical-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <p className="text-[9px] uppercase tracking-[0.2em] text-clinical-white/20">
              © 2026 naturalcureherbalmedicine
            </p>
            <div className="w-[1px] h-3 bg-clinical-white/10 hidden md:block" />
            <Link 
              href="https://mifimn.vercel.app" 
              target="_blank"
              className="group flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-clinical-white/20 hover:text-clinical-white transition-colors"
            >
              Architected by <span className="font-bold text-clinical-white/40 group-hover:text-clinical-white">~mifimn</span>
              <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-all" />
            </Link>
          </div>

          <button 
            onClick={scrollToTop} 
            className="flex items-center gap-2 text-[9px] uppercase tracking-[0.3em] text-clinical-white/30 hover:text-clinical-white transition-all group"
          >
            Top <ArrowUp size={12} className="group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

      </div>
    </footer>
  );
}

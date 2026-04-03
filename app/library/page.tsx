"use client";

import { motion } from "framer-motion";
import { ArrowRight, Leaf } from "lucide-react";
import Link from "next/link";

// Mock Database for Articles
const articles = [
  {
    id: 1,
    title: "The Science of Adaptogens",
    excerpt: "Understanding how Rhodiola and Ashwagandha modulate the endocrine system to manage chronic cortisol levels.",
    category: "Stress & Energy",
    readTime: "6 min read"
  },
  {
    id: 2,
    title: "Ancestral Immunity Rituals",
    excerpt: "Bridging the gap between cold-press extraction and cellular defense during peak infection seasons.",
    category: "Immunity",
    readTime: "8 min read"
  },
  {
    id: 3,
    title: "Gut-Brain Axis: A Botanical Map",
    excerpt: "How digestive bitters communicate with the nervous system to improve mental clarity and metabolic health.",
    category: "Digestion",
    readTime: "5 min read"
  }
];

export default function WellnessLibrary() {
  return (
    <main className="relative min-h-screen bg-botanical-green overflow-hidden">

      {/* 1. FIXED VIDEO BACKGROUND */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video 
          autoPlay loop muted playsInline
          className="w-full h-full object-cover opacity-40"
        >
          <source src="/library-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-botanical-green/80 via-botanical-green/60 to-botanical-green" />
      </div>

      {/* 2. BRAND IDENTITY (Top-Left) */}
      <div className="relative z-30 pt-12 px-6 sm:px-12 w-full flex justify-start">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-clinical-white/10 backdrop-blur-md p-2 rounded-full border border-clinical-white/20">
            <Leaf size={18} className="text-clinical-white" />
          </div>
          <span className="font-serif text-base sm:text-lg tracking-widest text-clinical-white lowercase opacity-80">
            naturalcareherbalmedicine
          </span>
        </Link>
      </div>

      {/* 3. LIBRARY CONTENT */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-6 sm:px-12 pt-24 pb-32">

        <header className="mb-20 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-clinical-white/40 mb-6">
              Official Research Ledger
            </p>
            <h1 className="font-serif text-5xl sm:text-7xl text-clinical-white tracking-tight leading-none mb-8">
              Wellness <br />
              <span className="italic font-light opacity-80">Library</span>
            </h1>
            <p className="font-sans text-lg sm:text-xl text-clinical-white/60 font-light leading-relaxed">
              In-depth research on botanical efficacy, dosage rituals, and the clinical science of nature’s apothecary.
            </p>
          </motion.div>
        </header>

        {/* 4. ARTICLE LIST WITH BORDER LINES */}
        <div className="flex flex-col border-t border-clinical-white/10">
          {articles.map((article, index) => (
            <motion.div 
              key={article.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link 
                href={`/library/${article.id}`} 
                className="group flex flex-col md:flex-row justify-between items-start md:items-center py-10 sm:py-14 border-b border-clinical-white/10 hover:bg-clinical-white/[0.03] transition-all duration-300"
              >
                <div className="max-w-xl pr-4">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 bg-clinical-white/10 text-clinical-white/80 rounded-sm">
                      {article.category}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-clinical-white/30">
                      {article.readTime}
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-4xl text-clinical-white mb-4 group-hover:text-earth-silk transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <p className="font-sans text-clinical-white/50 text-base sm:text-lg font-light leading-relaxed line-clamp-2">
                    {article.excerpt}
                  </p>
                </div>

                <div className="mt-8 md:mt-0 flex items-center gap-4 text-clinical-white md:opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 md:translate-x-[-10px] md:group-hover:translate-x-0">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] hidden sm:block">Explore</span>
                  <div className="w-10 h-10 rounded-full border border-clinical-white/20 flex items-center justify-center group-hover:border-clinical-white/50 group-hover:bg-clinical-white text-clinical-white group-hover:text-botanical-green transition-all">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </main>
  );
}
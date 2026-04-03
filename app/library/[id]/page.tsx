"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Link as LinkIcon, Check, Leaf, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";
import RelatedRemedies from "../../components/library/RelatedRemedies";

export default function ArticlePage() {
  const [copied, setCopied] = useState(false);

  // Mock Article Data
  const article = {
    title: "The Science of Adaptogens",
    subtitle: "Modulating the Endocrine System through Botanical Purity",
    category: "Clinical Research",
    readTime: "8 min read",
    date: "April 2026",
    content: `
      Adaptogens are a select group of botanicals that assist the body in restoring 
      homeostasis. Unlike stimulants, these compounds work on a cellular level to 
      regulate cortisol production without the typical "crash" associated with 
      synthetic alternatives... 

      Our research into Rhodiola Rosea suggests that peak potency is achieved 
      only through ancestral cold-press extraction, a method we have perfected 
      within our local apothecary labs.
    `
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-earth-silk pb-32">

      {/* 1. TOP NAVIGATION & SHARE */}
      <div className="w-full pt-32 pb-8 px-6 sm:px-12 max-w-[1600px] mx-auto flex justify-between items-center border-b border-botanical-green/10">
        <Link href="/library" className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-botanical-green/50 hover:text-botanical-green transition-all">
          <ArrowLeft size={14} /> Back to Library
        </Link>

        <div className="flex items-center gap-6">
          <button 
            onClick={handleCopyLink}
            className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-botanical-green/60 hover:text-botanical-green transition-all"
          >
            {copied ? <Check size={14} className="text-green-600" /> : <LinkIcon size={14} />}
            {copied ? "Link Copied" : "Copy Link"}
          </button>
          <Share2 size={16} className="text-botanical-green/40 cursor-pointer hover:text-botanical-green transition-all" />
        </div>
      </div>

      {/* 2. EDITORIAL HEADER */}
      <section className="max-w-[1000px] mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center items-center gap-4 mb-8 text-[10px] uppercase tracking-[0.4em] text-botanical-green/40">
            <span className="flex items-center gap-1"><Clock size={12} /> {article.readTime}</span>
            <span className="w-1 h-1 bg-botanical-green/20 rounded-full" />
            <span>{article.category}</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-botanical-green tracking-tight leading-[1.1] mb-8">
            {article.title}
          </h1>
          <p className="font-serif text-xl sm:text-2xl italic text-botanical-green/60 max-w-2xl mx-auto leading-relaxed">
            "{article.subtitle}"
          </p>
        </motion.div>
      </section>

      {/* 3. MAIN ARTICLE BODY */}
      <article className="max-w-[800px] mx-auto px-6 mb-32">
        <div className="w-12 h-[1px] bg-botanical-green/20 mb-12 mx-auto" />

        <div className="prose prose-lg font-sans text-botanical-green/80 leading-[1.8] space-y-8 text-lg sm:text-xl font-light">
          {/* In a real app, you would use a Rich Text renderer here */}
          <p>{article.content}</p>
          <p>The clinical efficacy of these botanicals is not merely anecdotal. By mapping the chemical markers of the plants against stress-hormone receptors, we find a direct correlation between dosage and systemic balance.</p>
        </div>

        <div className="mt-20 flex items-center gap-4 p-6 bg-botanical-green/[0.03] border border-botanical-green/10 italic text-botanical-green/60 text-sm">
          <Leaf size={20} className="shrink-0" />
          "Nature provides the compound; science provides the protocol." — The Archive
        </div>
      </article>

      {/* 4. CONTEXTUAL TAGGING: PAIRING REMEDIES */}
      {/* This component pulls in the Remedies we built in the previous step */}
      <RelatedRemedies />

    </main>
  );
}
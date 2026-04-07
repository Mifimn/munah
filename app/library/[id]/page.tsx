"use client";

import { useState, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Share2, Link as LinkIcon, Check, Leaf, Clock, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import RelatedRemedies from "../../components/library/RelatedRemedies";

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  // UNWRAP PARAMS HERE FOR NEXT.JS 15+
  const { id } = use(params);

  const [article, setArticle] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      setIsLoading(true);
      
      // Fetch the specific article using the ID from the URL
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setArticle(data);
        
        // Optional: Increment the views counter in the background!
        await supabase
          .from('articles')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', id);
      } else {
        console.error("Article not found:", error);
      }
      
      setIsLoading(false);
    }

    fetchArticle();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper functions
  const calculateReadTime = (text: string) => {
    if (!text) return "1 min read";
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  const category = article?.tags && article.tags.length > 0 ? article.tags[0] : "Clinical Research";
  const formattedDate = article ? new Date(article.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "";

  // Loading State
  if (isLoading) {
    return (
      <main className="min-h-screen bg-earth-silk flex items-center justify-center">
        <Loader2 className="animate-spin text-botanical-green/40" size={40} />
      </main>
    );
  }

  // Not Found State
  if (!article) {
    return (
      <main className="min-h-screen bg-earth-silk flex flex-col items-center justify-center">
        <h1 className="font-serif text-4xl text-botanical-green mb-4">Archive Not Found</h1>
        <Link href="/library" className="text-xs uppercase tracking-widest text-botanical-green/50 hover:text-botanical-green">Return to Library</Link>
      </main>
    );
  }

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
            <span className="flex items-center gap-1"><Clock size={12} /> {calculateReadTime(article.content)}</span>
            <span className="w-1 h-1 bg-botanical-green/20 rounded-full" />
            <span>{category}</span>
            <span className="w-1 h-1 bg-botanical-green/20 rounded-full" />
            <span>{formattedDate}</span>
          </div>

          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-botanical-green tracking-tight leading-[1.1] mb-8">
            {article.title}
          </h1>
          
          {/* Optional Cover Image */}
          {article.cover_image_url && (
            <div className="w-full max-w-4xl mx-auto mt-12 aspect-[21/9] bg-botanical-green/5 overflow-hidden">
              <img src={article.cover_image_url} alt={article.title} className="w-full h-full object-cover mix-blend-multiply opacity-90" />
            </div>
          )}
        </motion.div>
      </section>

      {/* 3. MAIN ARTICLE BODY */}
      <article className="max-w-[800px] mx-auto px-6 mb-32">
        <div className="w-12 h-[1px] bg-botanical-green/20 mb-12 mx-auto" />

        <div className="prose prose-lg font-sans text-botanical-green/80 leading-[1.8] space-y-8 text-lg sm:text-xl font-light whitespace-pre-wrap">
          {/* whitespace-pre-wrap ensures your database line-breaks are rendered properly! */}
          {article.content}
        </div>

        <div className="mt-20 flex items-center gap-4 p-6 bg-botanical-green/[0.03] border border-botanical-green/10 italic text-botanical-green/60 text-sm">
          <Leaf size={20} className="shrink-0" />
          "Nature provides the compound; science provides the protocol." — The Archive
        </div>
      </article>

      {/* 4. CONTEXTUAL TAGGING: PAIRING REMEDIES */}
      {/* Ensure you have this component created, or remove if you haven't built it yet! */}
      <RelatedRemedies />

    </main>
  );
}

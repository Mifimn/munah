"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Star, ArrowUpRight, ChevronDown, Leaf } from "lucide-react";
import Link from "next/link";

// Mock Data for the specific product with LIVE IMAGE URL
const product = {
  name: "Immunity Elixir",
  category: "Immunity",
  price: "$45.00",
  description: "A highly concentrated botanical tincture clinically formulated to fortify the immune response. Extracted using ancestral cold-press techniques to preserve active cellular compounds.",
  image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=1000&auto=format&fit=crop", 
  ingredients: "Echinacea Purpurea Root (organic), Elderberry Extract, Astragalus Root, Reishi Mushroom Fruiting Body, Organic Vegetable Glycerin, Purified Water.",
  usage: "Take 2 full droppers (2ml) daily. For acute support, take 2 droppers every 3-4 hours up to 4 times a day. Best taken under the tongue or mixed into a warm herbal tea.",
};

// Mock Data for related products with LIVE IMAGE URLS
const relatedProducts = [
  { 
    id: 3, 
    name: "Cellular Detox", 
    category: "Infections", 
    price: "$55.00", 
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: 5, 
    name: "Deep Sleep Botanicals", 
    category: "Sleep", 
    price: "$40.00", 
    image: "https://images.unsplash.com/photo-1596755389378-c11dde12061b?q=80&w=800&auto=format&fit=crop" 
  },
  { 
    id: 6, 
    name: "Digestive Bitters", 
    category: "Digestion", 
    price: "$35.00", 
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop" 
  },
];

export default function ProductDetails() {
  const [quantity, setQuantity] = useState(1);
  const [activeSection, setActiveSection] = useState<string | null>("ingredients");

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <main className="min-h-screen bg-earth-silk pb-32">

      {/* 1. TOP EDITORIAL HEADER (Tightened spacing) */}
      <div className="w-full pt-28 pb-6 px-6 sm:px-12 max-w-[1600px] mx-auto border-b border-botanical-green/10 mb-8 sm:mb-12">

        {/* Descriptive Title */}
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl sm:text-4xl text-botanical-green mb-6 sm:mb-8"
        >
          Authentic Plant Medicine
        </motion.h2>

        {/* Navigation & Domain (Visible on both PC and Mobile) */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <Link href="/shop" className="text-xs font-semibold uppercase tracking-[0.2em] text-botanical-green/50 hover:text-botanical-green transition-colors">
            ← Back to Archive
          </Link>

          <div className="flex items-center gap-2 text-botanical-green/40">
            <Leaf size={14} />
            <span className="font-serif text-sm tracking-widest lowercase">naturalcureherbalmedicine.com</span>
          </div>
        </div>
      </div>

      {/* 2. COMPLEX LAYOUT: Split Sticky Scroll */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-start gap-12 lg:gap-0">

        {/* Left Column: Sticky Image */}
        <div className="lg:sticky lg:top-32 p-6 sm:p-12 lg:pr-24 flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-[500px] aspect-[4/5] bg-botanical-green/5 overflow-hidden shadow-2xl"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-90 hover:scale-105 transition-transform duration-[2s] ease-out"
              style={{ backgroundImage: `url(${product.image})` }}
            />
          </motion.div>
        </div>

        {/* Right Column: Scrolling Details */}
        <div className="p-6 sm:p-12 lg:pl-0 lg:pr-24 lg:py-0 flex flex-col justify-center">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-botanical-green/50 mb-4 mt-8 lg:mt-0">
              {product.category}
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-botanical-green tracking-tight mb-6 leading-[1.1]">
              {product.name}
            </h1>
            <p className="font-sans text-2xl text-botanical-green mb-10">
              {product.price}
            </p>
            <p className="font-sans text-lg lg:text-xl text-botanical-green/80 leading-relaxed mb-12 font-light">
              {product.description}
            </p>

            {/* Premium Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16 border-t border-botanical-green/10 pt-10">
              <div className="flex items-center justify-between border border-botanical-green/30 rounded-full px-6 py-4 w-full sm:w-48 bg-transparent">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-botanical-green/50 hover:text-botanical-green transition-colors">
                  <Minus size={18} />
                </button>
                <span className="font-sans text-lg text-botanical-green">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="text-botanical-green/50 hover:text-botanical-green transition-colors">
                  <Plus size={18} />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#2C5535" }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-botanical-green text-clinical-white rounded-full text-sm font-bold uppercase tracking-widest py-4 sm:py-0 transition-colors shadow-lg"
              >
                Add to Ledger — ${(45.00 * quantity).toFixed(2)}
              </motion.button>
            </div>

            {/* Animated Accordions for Clinical Details */}
            <div className="border-t border-botanical-green/10">

              <div className="border-b border-botanical-green/10">
                <button 
                  onClick={() => toggleSection("ingredients")}
                  className="w-full flex items-center justify-between py-6 font-serif text-2xl text-botanical-green text-left hover:opacity-80 transition-opacity"
                >
                  Clinical Ingredients
                  <motion.div animate={{ rotate: activeSection === "ingredients" ? 180 : 0 }}>
                    <ChevronDown size={24} className="text-botanical-green/50" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeSection === "ingredients" && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 font-sans text-botanical-green/70 leading-relaxed font-light text-lg">
                        {product.ingredients}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="border-b border-botanical-green/10">
                <button 
                  onClick={() => toggleSection("usage")}
                  className="w-full flex items-center justify-between py-6 font-serif text-2xl text-botanical-green text-left hover:opacity-80 transition-opacity"
                >
                  Dosage & Ritual
                  <motion.div animate={{ rotate: activeSection === "usage" ? 180 : 0 }}>
                    <ChevronDown size={24} className="text-botanical-green/50" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {activeSection === "usage" && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pb-8 font-sans text-botanical-green/70 leading-relaxed font-light text-lg">
                        {product.usage}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>

          {/* Testimonial block specific to this product */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 p-8 sm:p-10 bg-botanical-green/5 border border-botanical-green/10"
          >
            <div className="flex gap-1.5 mb-6 text-botanical-green/90">
              {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="currentColor" strokeWidth={0} />)}
            </div>
            <p className="font-serif text-xl sm:text-2xl lg:text-3xl text-botanical-green italic mb-8 leading-relaxed">
              "Within a week of following the dosage ritual, my energy stabilized and the constant fatigue vanished. Truly potent."
            </p>
            <p className="text-xs uppercase tracking-widest text-botanical-green/60 font-semibold">
              — Michael T. <span className="opacity-60 ml-2">Verified Patient</span>
            </p>
          </motion.div>

        </div>
      </div>

      {/* 3. RELATED PRODUCTS SECTION */}
      <section className="w-full pt-32 px-6 sm:px-12 max-w-[1600px] mx-auto border-t border-botanical-green/10 mt-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
          <h2 className="font-serif text-4xl sm:text-5xl text-botanical-green tracking-tight">
            Complementary Remedies
          </h2>
          <Link href="/shop" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-botanical-green hover:opacity-70 transition-opacity">
            View Full Archive <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {relatedProducts.map((prod) => (
            <Link href={`/shop/${prod.id}`} key={prod.id} className="group relative block">
              <div className="relative aspect-square bg-botanical-green/5 overflow-hidden mb-6 flex items-center justify-center">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105 opacity-80 mix-blend-multiply"
                  style={{ backgroundImage: `url(${prod.image})` }}
                />

                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                  <button className="w-full bg-botanical-green text-clinical-white py-4 text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg">
                    <Plus size={16} /> Quick Add
                  </button>
                </div>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs uppercase tracking-widest text-botanical-green/50 mb-2">
                    {prod.category}
                  </p>
                  <h3 className="font-serif text-2xl text-botanical-green">{prod.name}</h3>
                </div>
                <p className="font-sans text-lg text-botanical-green">{prod.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </main>
  );
}
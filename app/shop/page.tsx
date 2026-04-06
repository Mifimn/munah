"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // Live DB connection

export default function ShopArchive() {
  const [products, setProducts] = useState<any[]>([]);
  const [ailments, setAilments] = useState<string[]>(["All"]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArchiveData();
  }, []);

  async function fetchArchiveData() {
    setIsLoading(true);
    
    // 1. Fetch Categories for the Ailment Index
    const { data: categoryData } = await supabase.from('categories').select('name');
    if (categoryData) {
      setAilments(["All", ...categoryData.map(c => c.name)]);
    }

    // 2. Fetch Active Products
    const { data: productData } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (productData) {
      const formattedProducts = productData.map(p => ({
        id: p.id,
        name: p.name,
        category: p.category_name || "Uncategorized",
        price: `₦${p.price.toLocaleString()}`,
        image: p.image_url || "" // Falls back to empty if no image exists yet
      }));
      setProducts(formattedProducts);
    }
    
    setIsLoading(false);
  }

  // Smart Filtering Logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeFilter === "All" || product.category === activeFilter;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-earth-silk pb-24">

      {/* 1. CINEMATIC EDITORIAL HEADER */}
      {/* FIXED: Reduced PC height (md:h-[45vh]) and added a max-height so it doesn't zoom too far on massive screens */}
      <section className="relative w-full h-[50vh] min-h-[400px] md:h-[45vh] max-h-[550px] flex flex-col items-center justify-center overflow-hidden">

        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/shop-bg.mp4" type="video/mp4" />
        </video>

        {/* FIXED OVERLAY: 
            1. Lightened the overall dark wash from 40% to 20%.
            2. Restricted the fade gradient to ONLY the bottom half (h-1/2) so the top of the video stays clear.
        */}
        <div className="absolute inset-0 bg-botanical-green/20 z-10" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--color-earth-silk)] to-transparent z-10" />

        {/* Floating Typography */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 text-center px-6 mt-16"
        >
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-clinical-white/90 mb-6 drop-shadow-md">
            The Apothecary Ledger
          </p>
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl text-clinical-white tracking-tight mb-6 leading-none drop-shadow-lg">
            The Archive
          </h1>
          <p className="font-sans text-clinical-white/90 text-lg max-w-xl mx-auto font-light leading-relaxed drop-shadow-md">
            Browse our complete ledger of clinically-backed botanical remedies. Sourced purely, targeted exactly.
          </p>
        </motion.div>
      </section>

      {/* 2. THE SHOP LEDGER (Content below the video) */}
      <div className="max-w-[1600px] mx-auto px-6 sm:px-12 mt-8 relative z-30">

        {/* Invisible Smart Search Line */}
        <div className="flex justify-end border-b border-botanical-green/20 pb-8 mb-12">
          <div className="relative w-full md:w-96 group">
            <Search size={18} className="absolute left-0 bottom-3 text-botanical-green/50 group-focus-within:text-botanical-green transition-colors" />
            <input 
              type="text" 
              placeholder="Search remedies, herbs, or ailments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-b border-botanical-green/30 pb-3 pl-8 text-botanical-green placeholder:text-botanical-green/40 focus:outline-none focus:border-botanical-green transition-colors font-sans"
            />
          </div>
        </div>

        {/* Complex Layout: Sticky Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

          {/* Left Column: The Sticky Ailment Index */}
          <div className="lg:col-span-3 lg:sticky lg:top-32 hidden md:block">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-botanical-green/50 mb-8 border-b border-botanical-green/10 pb-4">
              Ailment Index
            </h3>
            <ul className="flex flex-col gap-4">
              {ailments.map((ailment) => (
                <li key={ailment}>
                  <button
                    onClick={() => setActiveFilter(ailment)}
                    className={`font-serif text-xl sm:text-2xl text-left w-full transition-all duration-300 flex items-center justify-between ${
                      activeFilter === ailment 
                        ? "text-botanical-green italic" 
                        : "text-botanical-green/40 hover:text-botanical-green/70"
                    }`}
                  >
                    {ailment}
                    {activeFilter === ailment && (
                      <motion.div layoutId="activeDot" className="w-1.5 h-1.5 bg-botanical-green rounded-full" />
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile Filter Scroll (Visible only on small screens) */}
          <div className="md:hidden flex overflow-x-auto pb-4 gap-6 no-scrollbar border-b border-botanical-green/10 mb-8">
            {ailments.map((ailment) => (
              <button
                key={ailment}
                onClick={() => setActiveFilter(ailment)}
                className={`whitespace-nowrap font-serif text-xl ${
                  activeFilter === ailment ? "text-botanical-green italic border-b border-botanical-green" : "text-botanical-green/40"
                }`}
              >
                {ailment}
              </button>
            ))}
          </div>

          {/* Right Column: The Product Grid */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="w-full py-24 flex justify-center">
                <p className="font-serif text-2xl text-botanical-green/50 animate-pulse">Loading Archive...</p>
              </div>
            ) : (
              <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      key={product.id}
                      className="group relative"
                    >
                      <Link href={`/shop/${product.id}`} className="block">
                        {/* FIXED: Changed aspect-[3/4] to aspect-square to make the cards significantly shorter */}
                        <div className="relative aspect-square bg-botanical-green/5 overflow-hidden mb-6 flex items-center justify-center">
                          {product.image && (
                            <div 
                              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105 opacity-80 mix-blend-multiply"
                              style={{ backgroundImage: `url(${product.image})` }}
                            />
                          )}

                          {/* Quick Add Overlay */}
                          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                            <button className="w-full bg-botanical-green text-clinical-white py-4 text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#2C5535] transition-colors shadow-lg">
                              <Plus size={16} /> Quick Add
                            </button>
                          </div>
                        </div>

                        {/* Product Typography */}
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs uppercase tracking-widest text-botanical-green/50 mb-2">
                              {product.category}
                            </p>
                            <h2 className="font-serif text-2xl text-botanical-green">
                              {product.name}
                            </h2>
                          </div>
                          <p className="font-sans text-lg text-botanical-green">
                            {product.price}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && filteredProducts.length === 0 && (
              <div className="w-full py-24 text-center">
                <p className="font-serif text-2xl text-botanical-green/50">
                  No remedies found for this query.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}

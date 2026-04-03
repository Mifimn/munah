"use client";

import { motion } from "framer-motion";
import { Plus, Leaf, ArrowRight } from "lucide-react";
import Link from "next/link";

// Mock data: In a real app, you'd pass these as "props" based on the article's tags
const taggedProducts = [
  { 
    id: 1, 
    name: "Immunity Elixir", 
    reason: "Best for cellular defense discussed above",
    price: "$45.00", 
    image: "https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?q=80&w=1000&auto=format&fit=crop" 
  },
  { 
    id: 3, 
    name: "Cellular Detox", 
    reason: "Supports the metabolic pathways mentioned",
    price: "$55.00", 
    image: "https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop" 
  },
];

export default function RelatedRemedies() {
  return (
    <section className="w-full py-24 border-t border-clinical-white/10 bg-botanical-green/20 backdrop-blur-sm">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-12">

        {/* Header: Contextual Hook */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-4 text-clinical-white/40">
              <Leaf size={14} />
              <span className="text-[10px] uppercase tracking-[0.3em]">Clinical Pairings</span>
            </div>
            <h2 className="font-serif text-4xl sm:text-5xl text-clinical-white tracking-tight">
              Apply the <span className="italic font-light">Research</span>
            </h2>
          </motion.div>

          <Link href="/shop" className="group flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-clinical-white/60 hover:text-clinical-white transition-all">
            Full Archive <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* The Grid: Complex Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {taggedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative flex flex-col sm:flex-row bg-clinical-white/[0.03] border border-clinical-white/10 overflow-hidden hover:border-clinical-white/30 transition-all duration-500"
            >
              {/* Product Image: Square on mobile, Vertical on PC */}
              <div className="w-full sm:w-2/5 aspect-square sm:aspect-auto overflow-hidden bg-botanical-green/40">
                <div 
                  className="w-full h-full bg-cover bg-center mix-blend-multiply opacity-80 group-hover:scale-110 transition-transform duration-1000"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
              </div>

              {/* Product Content */}
              <div className="p-8 flex-1 flex flex-col justify-center">
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-clinical-white/30 mb-2 italic">
                    {product.reason}
                  </p>
                  <h3 className="font-serif text-3xl text-clinical-white mb-2">
                    {product.name}
                  </h3>
                  <p className="font-sans text-lg text-clinical-white/60">
                    {product.price}
                  </p>
                </div>

                <div className="flex gap-4 mt-auto">
                  <Link 
                    href={`/shop/${product.id}`}
                    className="flex-1 text-center py-3 border border-clinical-white/20 text-[10px] uppercase tracking-widest text-clinical-white hover:bg-clinical-white hover:text-botanical-green transition-all"
                  >
                    View Details
                  </Link>
                  <button className="p-3 bg-clinical-white text-botanical-green hover:bg-[#C2D6C6] transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-16 text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-clinical-white/20">
            Consult the ledger for full dosage protocols
          </p>
        </div>
      </div>
    </section>
  );
}
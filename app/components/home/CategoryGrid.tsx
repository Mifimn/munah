"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

// Updated Data Array using real Product Names and local paths from /public
const foundationalProducts = [
  { 
    id: 1, 
    name: "Original Honey", 
    // Image expected at public/original-honey.jpg
    image: "/original-honey.jpg", 
    link: "/shop?product=original-honey" 
  },
  { 
    id: 2, 
    name: "Camel Milk", 
    // Image expected at public/camel-milk.jpg
    image: "/camel-milk.jpg", 
    link: "/shop?product=camel-milk" 
  },
  { 
    id: 3, 
    name: "Breast Firming Oil", 
    // Image expected at public/breast-firming-oil.jpg
    image: "/breast-firming-oil.jpg", 
    link: "/shop?product=breast-firming-oil" 
  },
  { 
    id: 4, 
    name: "Weight Gain Powder", 
    // Image expected at public/weight-gain-powder.jpg
    image: "/weight-gain-powder.jpg", 
    link: "/shop?product=weight-gain-powder" 
  },
];

export default function CategoryGrid() {
  return (
    <section className="w-full bg-earth-silk pb-24">
      {/* Title Section */}
      <div className="w-full px-4 lg:px-8 max-w-[1400px] mx-auto mb-10 flex justify-between items-end">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-4xl sm:text-5xl text-botanical-green tracking-tight">
            Foundational Remedies
          </h2>
          <p className="font-sans text-sm sm:text-base text-botanical-green/60 mt-2 font-light">
            Explore our cornerstone clinical formulas.
          </p>
        </motion.div>
        <Link href="/shop" className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-botanical-green hover:opacity-60 transition-opacity">
          View Full Archive <ArrowUpRight size={14} />
        </Link>
      </div>

      {/* Grid Container */}
      <div className="w-full max-w-[1400px] mx-auto lg:px-8">
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-[2px] lg:gap-6 bg-botanical-green/5 lg:bg-transparent">
          {foundationalProducts.map((prod, index) => (
            <motion.div
              key={prod.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={prod.link} className="relative group block overflow-hidden bg-earth-silk aspect-[4/5] sm:aspect-auto sm:h-[600px]">

                {/* Background Image: Fetched from public folder */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-in-out group-hover:scale-105 opacity-90"
                  style={{ backgroundImage: `url(${prod.image})` }}
                />

                {/* Light gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-botanical-green/60 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content pinned to the bottom */}
                <div className="absolute bottom-0 left-0 w-full p-5 sm:p-8 flex justify-between items-end z-20">
                  <h3 className="font-serif text-2xl sm:text-3xl text-clinical-white leading-tight drop-shadow-sm max-w-[70%]">
                    {prod.name}
                  </h3>

                  {/* Elegant floating arrow button */}
                  <div className="w-9 h-9 rounded-full border border-clinical-white/40 flex items-center justify-center text-clinical-white backdrop-blur-md group-hover:bg-clinical-white group-hover:text-botanical-green transition-all duration-500">
                    <ArrowUpRight size={18} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile-only "View All" */}
      <div className="w-full flex justify-center mt-10 sm:hidden">
        <Link href="/shop" className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-botanical-green border-b border-botanical-green pb-1">
          View Full Archive <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  );
}

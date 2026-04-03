"use client";

import { motion } from "framer-motion";

export default function BrandStory() {
  return (
    <section className="w-full bg-earth-silk py-32 sm:py-48 px-6 sm:px-12 relative overflow-hidden">

      {/* Decorative Background Element */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-botanical-green/10" />

      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

        {/* Left Column: Sticky Heading */}
        <div className="lg:col-span-5 lg:sticky lg:top-32">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-botanical-green/60 mb-6"
          >
            Our Philosophy
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="font-serif text-5xl sm:text-7xl text-botanical-green leading-[1.1] tracking-tight"
          >
            Clinical standards. <br />
            <span className="italic font-light text-botanical-green/80">Natural origins.</span>
          </motion.h2>
        </div>

        {/* Right Column: Flowing Narrative */}
        <div className="lg:col-span-7 flex flex-col gap-10 sm:gap-16 mt-8 lg:mt-0">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="font-sans text-xl sm:text-3xl text-botanical-green leading-relaxed"
          >
            We are transitioning from standard, fragmented herbal remedies into a unified, premium digital apothecary. Our mission is to bridge the gap between ancestral plant medicine and modern clinical rigor.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 border-t border-botanical-green/20"
          >
            <div>
              <h3 className="font-serif text-2xl text-botanical-green mb-4">Sourced Purely</h3>
              <p className="text-botanical-green/70 leading-relaxed">
                Every ingredient is harvested at peak potency, ensuring the active compounds remain intact from the soil to your sanctuary.
              </p>
            </div>
            <div>
              <h3 className="font-serif text-2xl text-botanical-green mb-4">Targeted Cures</h3>
              <p className="text-botanical-green/70 leading-relaxed">
                We reject the "cure-all" myth. Our platform matches specific, clinically studied herbs to your precise health challenges.
              </p>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}

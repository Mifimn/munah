"use client";

import { useState, useEffect, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Star, ArrowUpRight, ChevronDown, Leaf, Droplet, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; 

export default function ProductDetails({ params }: { params: Promise<{ slug: string }> }) {
  // UNWRAP PARAMS HERE FOR NEXT.JS 15+
  const { slug } = use(params);

  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();

  // Interactive States
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<any>(null); 
  const [activeSection, setActiveSection] = useState<string | null>("ingredients");

  // Fetch Data on Load
  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true);
      
      // 1. Fetch current product based on the unwrapped SLUG
      const { data: currentProduct } = await supabase
        .from('products')
        .select('*')
        .eq('id', slug) 
        .single();

      if (currentProduct) {
        setProduct(currentProduct);

        // 2. Set the initial variant/size to the first one in the JSON array
        if (currentProduct.variants && currentProduct.variants.length > 0) {
          setSelectedVariant(currentProduct.variants[0]);
        } else {
          // Fallback for older products before variants were added
          setSelectedVariant({ size: currentProduct.volume || 'Standard Size', price: currentProduct.price });
        }

        // 3. Fetch related products from the same category (MAX 4)
        const { data: related } = await supabase
          .from('products')
          .select('*')
          .eq('category_name', currentProduct.category_name)
          .neq('id', currentProduct.id)
          .limit(4); 
          
        if (related) setRelatedProducts(related);
      }
      
      setIsLoading(false);
    }

    fetchProduct();
  }, [slug]);

  // --- FIXED: Smart Add to Cart Logic ---
  const handleAddToCart = async () => {
    setIsAdding(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/account");
      return;
    }

    // 1. Check if this product is already in their cart
    const { data: existingCartItem } = await supabase
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle(); // maybeSingle prevents crash if it doesn't exist yet

    if (existingCartItem) {
      // 2. If it exists, UPDATE it by adding the new quantity to the old quantity
      const { error } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingCartItem.quantity + quantity 
        })
        .eq('id', existingCartItem.id);

      if (!error) router.push("/account/ledger");
    } else {
      // 3. If it does not exist, INSERT a brand new row with the quantity
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity: quantity,
          // NOTE: If you added a variant_size column to your DB, uncomment the line below!
          // variant_size: selectedVariant?.size || 'Standard'
        });

      if (!error) router.push("/account/ledger");
    }

    setIsAdding(false);
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  // Loading Screen
  if (isLoading) {
    return (
      <main className="min-h-screen bg-earth-silk flex items-center justify-center">
        <Loader2 className="animate-spin text-botanical-green/40" size={40} />
      </main>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <main className="min-h-screen bg-earth-silk flex flex-col items-center justify-center pt-32 pb-32">
        <h1 className="font-serif text-4xl text-botanical-green mb-4">Remedy Not Found</h1>
        <Link href="/shop" className="text-xs uppercase tracking-widest text-botanical-green/50 hover:text-botanical-green">Return to Archive</Link>
      </main>
    );
  }

  // Calculate final price based on dynamically selected variant
  const currentUnitPrice = selectedVariant ? parseFloat(selectedVariant.price) : product.price;
  const totalPrice = currentUnitPrice * quantity;

  // Determine what list to map for the size buttons
  const availableVariants = product.variants && product.variants.length > 0 
    ? product.variants 
    : [selectedVariant];

  return (
    <main className="min-h-screen bg-earth-silk pb-32">

      {/* 1. TOP EDITORIAL HEADER */}
      <div className="w-full pt-28 pb-6 px-6 sm:px-12 max-w-[1600px] mx-auto border-b border-botanical-green/10 mb-8 sm:mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-3xl sm:text-4xl text-botanical-green mb-6 sm:mb-8"
        >
          Authentic Superfoods
        </motion.h2>

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

      {/* 2. COMPLEX LAYOUT */}
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 items-start gap-12 lg:gap-0">

        {/* Left Column: Sticky Image */}
        <div className="lg:sticky lg:top-32 p-6 sm:p-12 lg:pr-24 flex justify-center lg:justify-end">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative w-full max-w-[500px] aspect-[4/5] bg-botanical-green/5 overflow-hidden shadow-2xl border border-botanical-green/10"
          >
            {product.image_url && (
              <div 
                className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-90 hover:scale-105 transition-transform duration-[2s] ease-out"
                style={{ backgroundImage: `url(${product.image_url})` }}
              />
            )}
          </motion.div>
        </div>

        {/* Right Column: Scrolling Details */}
        <div className="p-6 sm:p-12 lg:pl-0 lg:pr-24 lg:py-0 flex flex-col justify-center">

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-botanical-green/50 mb-4 mt-8 lg:mt-0">
              {product.category_name || "Botanical Extract"}
            </p>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-botanical-green tracking-tight mb-6 leading-[1.1]">
              {product.name}
            </h1>
            
            <p className="font-sans text-3xl text-botanical-green mb-10 font-bold">
              ₦{currentUnitPrice.toLocaleString()}
            </p>

            <p className="font-sans text-lg lg:text-xl text-botanical-green/80 leading-relaxed mb-10 font-light">
              {product.description || "Clinically formulated botanical extract designed for peak vitality."}
            </p>

            {/* --- DYNAMIC SIZE/VARIANT SELECTION --- */}
            <div className="mb-10">
              <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2 mb-4">
                <Droplet size={14} /> Select Volume / Size
              </label>
              <div className="flex flex-wrap gap-3">
                {availableVariants.map((variant: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                      selectedVariant?.size === variant.size 
                      ? "bg-botanical-green text-clinical-white border-botanical-green shadow-md" 
                      : "bg-transparent text-botanical-green border-botanical-green/20 hover:border-botanical-green"
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>

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
                onClick={handleAddToCart}
                disabled={isAdding}
                whileHover={{ scale: 1.02, backgroundColor: "#2C5535" }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 bg-botanical-green text-clinical-white rounded-full text-xs font-bold uppercase tracking-widest py-4 sm:py-0 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isAdding ? <Loader2 size={16} className="animate-spin" /> : null}
                {isAdding ? "Adding..." : `Add to Ledger — ₦${totalPrice.toLocaleString()}`}
              </motion.button>
            </div>

            {/* Animated Accordions */}
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
                        {product.ingredients || "Proprietary wild-harvested botanical blend."}
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
                        {product.usage || "Use as directed by your clinical practitioner."}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Testimonial block */}
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
              "The quality of this remedy is incomparable. You can sense the wild botanical origin. It has become a staple in my health protocol."
            </p>
            <p className="text-xs uppercase tracking-widest text-botanical-green/60 font-semibold">
              — Verified Case Study <span className="opacity-60 ml-2">Clinical Patient</span>
            </p>
          </motion.div>

        </div>
      </div>

      {/* 3. RELATED PRODUCTS SECTION */}
      {relatedProducts.length > 0 && (
        <section className="w-full pt-32 px-6 sm:px-12 max-w-[1600px] mx-auto border-t border-botanical-green/10 mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-6">
            <h2 className="font-serif text-4xl sm:text-5xl text-botanical-green tracking-tight">
              Complementary Remedies
            </h2>
            <Link href="/shop" className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-botanical-green hover:opacity-70 transition-opacity">
              View Full Archive <ArrowUpRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {relatedProducts.map((prod) => (
              <Link href={`/shop/${prod.id}`} key={prod.id} className="group relative block">
                <div className="relative aspect-square bg-botanical-green/5 overflow-hidden mb-6 flex items-center justify-center border border-botanical-green/5">
                  {prod.image_url && (
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out group-hover:scale-105 opacity-80 mix-blend-multiply"
                      style={{ backgroundImage: `url(${prod.image_url})` }}
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                    <button className="w-full bg-botanical-green text-clinical-white py-4 text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg">
                      <Plus size={16} /> View Remedy
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-botanical-green/50 mb-2">
                      {prod.category_name}
                    </p>
                    <h3 className="font-serif text-2xl text-botanical-green">{prod.name}</h3>
                  </div>
                  <p className="font-sans text-lg text-botanical-green">
                    ₦{(prod.variants?.[0]?.price || prod.price || 0).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}
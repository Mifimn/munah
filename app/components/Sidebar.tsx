"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, LogOut, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const [cartCount, setCartCount] = useState(0); 

  const { user } = useAuth(); // Real authentication state
  const pathname = usePathname();
  const router = useRouter();

  // Scroll Listener for Logo
  useEffect(() => {
    const handleScroll = () => {
      setShowBrand(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch real cart count from database
  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }

    const fetchCartCount = async () => {
      const { count } = await supabase
        .from('cart_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      setCartCount(count || 0);
    };

    fetchCartCount();

    // Optional: Real-time subscription to update cart count instantly when items are added
    const channel = supabase
      .channel('custom-all-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cart_items', filter: `user_id=eq.${user.id}` }, () => {
        fetchCartCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Hides the Sidebar completely on the Admin page
  if (pathname.startsWith("/admin")) return null;

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Archive", href: "/shop" },
    { name: "Library", href: "/library" },
    { name: "Account", href: "/account/ledger" },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    router.push("/account");
  };

  return (
    <>
      {/* --- TOP GLOBAL NAVIGATION --- */}
      <div className="fixed top-0 left-0 z-50 w-full pointer-events-none">
        <div className="max-w-[1600px] mx-auto px-6 py-8 sm:py-12 flex justify-between items-center">

          {/* LOGO (Fades in on scroll) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: showBrand ? 1 : 0, scale: showBrand ? 1 : 0.8 }}
            className="pointer-events-auto"
          >
            {/* Removed padding, borders, and background from the logo wrapper */}
            <Link href="/" className="group flex items-center justify-center hover:opacity-80 transition-all duration-500">
               <Image 
                src="/logo.png" 
                alt="Natural Cure Logo" 
                width={36} 
                height={36} 
                className="object-contain rounded-full"
              />
            </Link>
          </motion.div>

          {/* PC INDEX & TOGGLE */}
          <div className="flex items-center gap-4 pointer-events-auto">
            <nav className="hidden lg:flex items-center border border-clinical-white/20 bg-botanical-green/10 backdrop-blur-md rounded-full overflow-hidden">
              {menuItems.map((item, index) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className={`px-6 py-3 text-[10px] uppercase tracking-[0.3em] transition-all flex items-center gap-2
                    ${pathname === item.href ? "text-clinical-white bg-botanical-green/20 font-bold" : "text-clinical-white/60 hover:text-clinical-white"}
                    ${index !== menuItems.length - 1 ? "border-r border-clinical-white/10" : ""}
                  `}
                >
                  {item.name}
                  {item.name === "Account" && cartCount > 0 && (
                    <span className="bg-clinical-white text-botanical-green px-1.5 py-0.5 rounded-full text-[8px] font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* MOBILE TOGGLE (With Notification Count) */}
            <button 
              onClick={() => setIsOpen(true)}
              className="relative p-4 bg-botanical-green text-clinical-white rounded-full shadow-2xl active:scale-90 transition-transform lg:hidden"
            >
              <Menu size={20} strokeWidth={2} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-clinical-white text-botanical-green text-[9px] font-bold flex items-center justify-center rounded-full border-2 border-botanical-green">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* --- REDESIGNED SMART SIDEBAR (SLIDE-OUT DRAWER) --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Blurred Background Overlay */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm lg:hidden"
            />

            {/* Side Drawer */}
            <motion.div 
              initial={{ x: "100%" }} 
              animate={{ x: 0 }} 
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-[100] w-full sm:w-[400px] bg-botanical-green shadow-2xl border-l border-clinical-white/10 flex flex-col lg:hidden"
            >
              {/* Sidebar Header */}
              <div className="flex justify-between items-center px-5 py-5 border-b border-clinical-white/10">
                <div className="flex items-center gap-3">
                  {/* Removed brightness-0 invert opacity-60 */}
                  <Image 
                    src="/logo.png" 
                    alt="Natural Cure Logo" 
                    width={28} 
                    height={28} 
                    className="object-contain rounded-full" 
                  />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-clinical-white/80 font-bold">Index</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-3 bg-clinical-white/5 hover:bg-clinical-white/10 transition-colors rounded-full text-clinical-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Sidebar Navigation */}
              <nav className="flex-1 flex flex-col px-8 py-6 gap-2 overflow-y-auto">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.1 }}
                  >
                    <Link 
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between py-5 border-b border-clinical-white/5"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-clinical-white/20 font-serif italic text-sm">0{index + 1}</span>
                        <span className={`text-3xl font-serif tracking-tight transition-all ${
                          pathname === item.href ? "text-clinical-white italic" : "text-clinical-white/70 group-hover:text-clinical-white"
                        }`}>
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.name === "Account" && cartCount > 0 && (
                          <span className="text-[9px] bg-clinical-white text-botanical-green px-2 py-1 rounded-full font-bold">
                            {cartCount}
                          </span>
                        )}
                        <ArrowRight className="text-clinical-white/40 group-hover:text-clinical-white transition-all -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" size={18} />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Sidebar Footer & Auth Logic */}
              <div className="mt-auto border-t border-clinical-white/10 bg-black/10">
                {/* Dynamic Login/Logout Button */}
                <div className="px-8 py-6 border-b border-clinical-white/5">
                  {user ? (
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-3 text-clinical-white/60 group-hover:text-red-400 transition-colors uppercase text-[10px] tracking-[0.3em] font-bold">
                        <LogOut size={16} /> Logout
                      </span>
                    </button>
                  ) : (
                    <Link 
                      href="/account"
                      onClick={() => setIsOpen(false)}
                      className="w-full flex items-center justify-between group"
                    >
                      <span className="flex items-center gap-3 text-clinical-white uppercase text-[10px] tracking-[0.3em] font-bold transition-colors">
                        <User size={16} /> Client Login
                      </span>
                      <ArrowRight size={16} className="text-clinical-white/40 group-hover:text-clinical-white transition-colors" />
                    </Link>
                  )}
                </div>

                {/* Brand Info */}
                <div className="px-8 py-6 flex justify-between items-end">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-clinical-white/30 mb-1.5">Apothecary</p>
                    <p className="text-[11px] text-clinical-white/70 font-serif lowercase tracking-widest leading-none">naturalcure</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] uppercase tracking-widest text-clinical-white/30 mb-1.5">Ethics</p>
                    <p className="text-[11px] text-clinical-white/70 italic leading-none">Clinical Purity.</p>
                  </div>
                </div>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

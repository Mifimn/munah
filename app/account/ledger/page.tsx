"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, User, ArrowRight, Package, Clock, LogOut, Leaf, Truck, RefreshCw, ChevronRight, X, CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function MemberLedger() {
  const [activeTab, setActiveTab] = useState("cart");
  const [showDrawer, setShowDrawer] = useState(false); // Toggle for tracking drawer
  const router = useRouter();

  // --- MOCK DATA ---
  const cartItems = [{ id: 1, name: "Immunity Elixir", price: 45000, qty: 1 }];
  const activeOrders = [{ id: "ORD-9921", status: "In Formulation", date: "April 03, 2026" }];
  const pastOrders = [{ id: "ORD-8840", status: "Delivered", date: "March 12, 2026", total: 45000 }];

  // Tracking Steps
  const trackingSteps = [
    { title: "Order Received", desc: "Apothecary ledger updated", status: "complete" },
    { title: "Botanical Sourcing", desc: "Selecting active ingredients", status: "complete" },
    { title: "Clinical Extraction", desc: "In formulation at laboratory", status: "current" },
    { title: "Secure Packaging", desc: "Sealing in violet glass", status: "pending" },
    { title: "Dispatched", desc: "Handed to logistics partner", status: "pending" },
  ];

  const handleLogout = () => router.push("/account");

  return (
    <main className="min-h-screen bg-earth-silk pt-24 pb-20 px-4 sm:px-6 relative overflow-x-hidden">

      {/* --- TRACKING DRAWER OVERLAY --- */}
      <AnimatePresence>
        {showDrawer && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-botanical-green/40 backdrop-blur-sm z-[100]"
            />
            {/* Drawer */}
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-clinical-white z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-botanical-green/5 flex justify-between items-center">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-botanical-green/40 font-bold">Logistics Trace</p>
                  <h2 className="font-serif text-2xl text-botanical-green">Order ORD-9921</h2>
                </div>
                <button onClick={() => setShowDrawer(false)} className="p-3 bg-botanical-green/5 rounded-full text-botanical-green hover:bg-botanical-green hover:text-white transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 md:p-12">
                <div className="relative space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-botanical-green/10">
                  {trackingSteps.map((step, i) => (
                    <div key={i} className="flex gap-6 relative">
                      {/* Status Icon */}
                      <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 z-10 transition-colors duration-500
                        ${step.status === 'complete' ? 'bg-botanical-green text-white' : 
                          step.status === 'current' ? 'bg-white border-2 border-botanical-green animate-pulse' : 'bg-earth-silk border border-botanical-green/10'}`}>
                        {step.status === 'complete' && <CheckCircle2 size={14} />}
                      </div>
                      {/* Text Content */}
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-widest ${step.status === 'pending' ? 'text-botanical-green/20' : 'text-botanical-green'}`}>
                          {step.title}
                        </p>
                        <p className="text-[11px] text-botanical-green/40 font-light mt-1">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 bg-botanical-green/5 border-t border-botanical-green/5">
                <div className="flex items-center gap-4 text-botanical-green/60 italic text-xs">
                  <Truck size={16} />
                  <span>Estimated Arrival: 2-3 Business Days</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-[1200px] mx-auto">
        {/* --- 1. MEMBER IDENTITY HEADER --- */}
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-botanical-green/10 pb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-botanical-green rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-botanical-green/40 font-bold">Verified Member</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-botanical-green tracking-tighter">Musa Ayoola</h1>
            <p className="text-sm text-botanical-green/60 font-light mt-1">musa.ayoola@kwasu.edu.ng</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <button onClick={() => setActiveTab("cart")} className={`text-[10px] md:text-[11px] uppercase tracking-widest font-bold transition-all relative py-2 ${activeTab === 'cart' ? 'text-botanical-green' : 'text-botanical-green/30'}`}>Ledger ({cartItems.length}) {activeTab === 'cart' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-[2px] bg-botanical-green" />}</button>
            <button onClick={() => setActiveTab("tracking")} className={`text-[10px] md:text-[11px] uppercase tracking-widest font-bold transition-all relative py-2 ${activeTab === 'tracking' ? 'text-botanical-green' : 'text-botanical-green/30'}`}>Order History {activeTab === 'tracking' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-[2px] bg-botanical-green" />}</button>
            <button onClick={handleLogout} className="p-2 hover:bg-botanical-green/5 rounded-full transition-colors ml-auto md:ml-0"><LogOut size={18} className="text-botanical-green/20" /></button>
          </div>
        </header>

        {/* --- 2. DYNAMIC CONTENT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === "cart" ? (
                <motion.section key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-clinical-white p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center border border-botanical-green/5 shadow-sm gap-6">
                      <div className="flex items-center gap-6 w-full sm:w-auto">
                        <div className="w-16 h-16 bg-botanical-green/5 rounded-sm flex items-center justify-center shrink-0"><ShoppingBag size={20} className="text-botanical-green/30" /></div>
                        <div><h3 className="font-serif text-xl md:text-2xl text-botanical-green">{item.name}</h3><p className="text-[10px] text-botanical-green/40 uppercase tracking-[0.2em] mt-1">50ml Extract</p></div>
                      </div>
                      <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto border-t sm:border-0 pt-4 sm:pt-0">
                        <p className="font-sans text-lg md:text-xl text-botanical-green font-light">₦{item.price.toLocaleString()}</p>
                        <button className="text-[9px] uppercase tracking-widest text-red-800/40 hover:text-red-800 mt-1">Remove</button>
                      </div>
                    </div>
                  ))}
                </motion.section>
              ) : (
                <motion.section key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-botanical-green/40 mb-6 font-bold">Active Formulations</h2>
                    {activeOrders.map((order) => (
                      <div key={order.id} className="bg-clinical-white p-6 md:p-10 border border-botanical-green/5 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] hidden sm:block"><Truck size={100} /></div>
                        <div className="flex flex-col gap-6 relative z-10">
                          <div className="flex justify-between items-start">
                            <div><span className="text-[10px] uppercase tracking-[0.4em] text-botanical-green/40 font-bold">{order.id}</span><h4 className="font-serif text-2xl md:text-3xl text-botanical-green mt-1">Formulating Extract</h4></div>
                            <div className="px-4 py-1.5 bg-botanical-green text-clinical-white rounded-full text-[9px] uppercase font-bold tracking-widest">{order.status}</div>
                          </div>
                          <div className="flex items-center gap-6 text-[10px] text-botanical-green/60 uppercase tracking-widest border-t border-botanical-green/5 pt-6">
                            <span className="flex items-center gap-2"><Clock size={12}/> Registered {order.date}</span>
                            <button onClick={() => setShowDrawer(true)} className="flex items-center gap-1 text-botanical-green font-bold">Track Logs <ChevronRight size={12}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Past Orders - Left as per your request */}
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-botanical-green/40 mb-6 font-bold">Botanical History</h2>
                    {pastOrders.map((order) => (
                      <div key={order.id} className="bg-white/40 p-5 flex flex-col sm:flex-row justify-between items-center border border-botanical-green/5 group hover:bg-white transition-all">
                        <div className="flex items-center gap-4 w-full sm:w-auto"><Package size={16} className="text-botanical-green/30" /><div><p className="text-[10px] font-bold text-botanical-green/60">{order.id} — {order.date}</p><p className="text-xs text-botanical-green font-serif">Settlement: ₦{order.total.toLocaleString()}</p></div></div>
                        <button className="mt-4 sm:mt-0 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold bg-botanical-green/5 hover:bg-botanical-green hover:text-white px-5 py-2.5 rounded-full transition-all w-full sm:w-auto justify-center"><RefreshCw size={12} /> Reorder Extract</button>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          {/* --- 3. SUMMARY SIDEBAR --- */}
          <div className="lg:col-span-4">
            <div className="bg-botanical-green p-8 md:p-10 text-clinical-white rounded-sm shadow-2xl relative overflow-hidden lg:sticky lg:top-32">
              <Leaf className="absolute -bottom-10 -right-10 text-clinical-white/5 w-40 h-40" />
              <h3 className="font-serif text-3xl mb-8">Summary</h3>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-sm opacity-60"><span>Subtotal</span><span>₦45,000</span></div>
                <div className="flex justify-between text-sm opacity-60"><span>Logistics</span><span className="text-[10px] uppercase">Checkout Calc</span></div>
                <div className="pt-6 border-t border-clinical-white/10 flex justify-between text-2xl font-serif"><span>Total</span><span>₦45,000</span></div>
              </div>
              <Link href="/checkout" className="w-full bg-clinical-white text-botanical-green py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-earth-silk transition-all shadow-xl">Proceed to Checkout <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

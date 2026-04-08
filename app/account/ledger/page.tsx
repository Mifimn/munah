"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, User, ArrowRight, Package, Clock, LogOut, Leaf, Truck, RefreshCw, ChevronRight, X, CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Live DB connection

export default function MemberLedger() {
  const [activeTab, setActiveTab] = useState("cart");
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isReceiptMode, setIsReceiptMode] = useState(false); // Toggle between Tracking and Receipt
  const router = useRouter();

  // --- REAL DATABASE STATE ---
  const [userProfile, setUserProfile] = useState<{ full_name: string; email: string } | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push("/account");
      return;
    }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    
    setUserProfile({
      full_name: profile?.full_name || "Valued Member",
      email: user.email || "",
    });

    if (profile && profile.welcome_email_sent !== true) {
      try {
        const response = await fetch('/api/send-ebook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, name: profile.full_name }),
        });

        if (response.ok) {
          await supabase.from('profiles').update({ welcome_email_sent: true }).eq('id', user.id);
        }
      } catch (err) {
        console.error("Network failed to reach API:", err);
      }
    }

    const { data: cartData } = await supabase
      .from('cart_items')
      .select(`id, quantity, product_id, products (name, price)`)
      .eq('user_id', user.id);
      
    if (cartData) {
      const formattedCart = cartData.map((item: any) => ({
        id: item.id,
        name: item.products?.name || "Unknown Product",
        price: item.products?.price || 0,
        qty: item.quantity
      }));
      setCartItems(formattedCart);
    }

    // Fetched order_items too so receipt has the details!
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*, order_items(*)') 
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (ordersData) {
      setActiveOrders(ordersData.filter(o => o.status !== 'Delivered'));
      setPastOrders(ordersData.filter(o => o.status === 'Delivered'));
    }
    
    setIsLoading(false);
  }

  // --- HANDLERS ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/account");
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    await supabase.from('cart_items').delete().eq('id', cartItemId);
    setCartItems(cartItems.filter(item => item.id !== cartItemId));
  };

  const openTracking = (order: any) => {
    setSelectedOrder(order);
    setIsReceiptMode(false); // Show timeline by default for active orders
    setShowDrawer(true);
  };

  const openReceipt = (order: any) => {
    setSelectedOrder(order);
    setIsReceiptMode(true); // Show receipt directly for past orders
    setShowDrawer(true);
  };

  // --- DYNAMIC CALCULATIONS ---
  const cartSubtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const statuses = ["Order Received", "In Formulation", "Ready for Dispatch", "Dispatched", "Delivered"];
  const currentStatusIndex = selectedOrder ? statuses.indexOf(selectedOrder.status) : 0;

  const trackingSteps = [
    { title: "Order Received", desc: "Apothecary ledger updated", status: currentStatusIndex >= 0 ? (currentStatusIndex === 0 ? "current" : "complete") : "pending" },
    { title: "In Formulation", desc: "Laboratory extraction in progress", status: currentStatusIndex >= 1 ? (currentStatusIndex === 1 ? "current" : "complete") : "pending" },
    { title: "Ready for Dispatch", desc: "Securely packaged in violet glass", status: currentStatusIndex >= 2 ? (currentStatusIndex === 2 ? "current" : "complete") : "pending" },
    { title: "Dispatched", desc: "Handed to Logistics partner", status: currentStatusIndex >= 3 ? (currentStatusIndex === 3 ? "current" : "complete") : "pending" },
    { title: "Delivered", desc: "Package safely arrived at destination", status: currentStatusIndex >= 4 ? (currentStatusIndex === 4 ? "current" : "complete") : "pending" },
  ];

  return (
    <main className="min-h-screen bg-earth-silk pt-24 pb-20 px-4 sm:px-6 relative overflow-x-hidden">

      {/* --- TRACKING & RECEIPT DRAWER OVERLAY --- */}
      <AnimatePresence>
        {showDrawer && selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDrawer(false)}
              className="fixed inset-0 bg-botanical-green/40 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-clinical-white z-[110] shadow-2xl flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-botanical-green/10 flex justify-between items-center bg-earth-silk/50">
                <div className="flex gap-4">
                  <button onClick={() => setIsReceiptMode(false)} className={`text-[10px] uppercase tracking-[0.2em] font-bold pb-1 ${!isReceiptMode ? 'border-b-2 border-botanical-green text-botanical-green' : 'text-botanical-green/40'}`}>Logistics Trace</button>
                  <button onClick={() => setIsReceiptMode(true)} className={`text-[10px] uppercase tracking-[0.2em] font-bold pb-1 ${isReceiptMode ? 'border-b-2 border-botanical-green text-botanical-green' : 'text-botanical-green/40'}`}>Receipt View</button>
                </div>
                <button onClick={() => setShowDrawer(false)} className="p-2 bg-botanical-green/5 rounded-full text-botanical-green hover:bg-botanical-green hover:text-white transition-all"><X size={18} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {!isReceiptMode ? (
                  // LOGISTICS TRACKING VIEW
                  <>
                    <h2 className="font-serif text-2xl text-botanical-green mb-8">Order {selectedOrder.order_number}</h2>
                    <div className="relative space-y-12 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-botanical-green/10">
                      {trackingSteps.map((step, i) => (
                        <div key={i} className="flex gap-6 relative">
                          <div className={`w-[24px] h-[24px] rounded-full flex items-center justify-center shrink-0 z-10 transition-colors duration-500
                            ${step.status === 'complete' ? 'bg-botanical-green text-white' : 
                              step.status === 'current' ? 'bg-white border-2 border-botanical-green animate-pulse' : 'bg-earth-silk border border-botanical-green/10'}`}>
                            {step.status === 'complete' && <CheckCircle2 size={14} />}
                          </div>
                          <div>
                            <p className={`text-xs font-bold uppercase tracking-widest ${step.status === 'pending' ? 'text-botanical-green/20' : 'text-botanical-green'}`}>
                              {step.title}
                            </p>
                            <p className="text-[11px] text-botanical-green/40 font-light mt-1">{step.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  // CLINICAL RECEIPT VIEW
                  <div className="bg-white border border-gray-200 p-8 shadow-sm">
                    <div className="text-center mb-8 border-b border-gray-200 pb-8">
                      <h1 className="font-serif text-2xl text-black tracking-widest uppercase">Natural Cure</h1>
                      <p className="text-[9px] uppercase tracking-[0.3em] text-gray-500 mt-1">Clinical Botanical Apothecary</p>
                    </div>
                    
                    <div className="flex justify-between text-sm text-black mb-8">
                      <div>
                        <p className="text-[9px] uppercase text-gray-400 mb-1">Billed To</p>
                        <p className="font-bold">{selectedOrder.customer_name}</p>
                        <p>{selectedOrder.customer_phone}</p>
                        <p className="max-w-[150px]">{selectedOrder.shipping_address}, {selectedOrder.city}, {selectedOrder.state}, {selectedOrder.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] uppercase text-gray-400 mb-1">Receipt Details</p>
                        <p><span className="text-gray-500">No:</span> {selectedOrder.order_number}</p>
                        <p><span className="text-gray-500">Date:</span> {new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <table className="w-full text-sm text-black mb-8 border-t border-gray-200 pt-4">
                      <tbody>
                        {selectedOrder.order_items?.map((item: any, idx: number) => (
                          <tr key={idx} className="border-b border-gray-100">
                            <td className="py-4 font-serif">{item.product_name}</td>
                            <td className="py-4 text-center">{item.quantity}</td>
                            <td className="py-4 text-right">₦{item.unit_price.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div className="flex justify-between text-sm border-t border-gray-200 pt-4 mb-2">
                      <span className="text-gray-500">Shipping</span>
                      <span>₦{selectedOrder.shipping_fee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-end text-lg font-bold">
                      <span>Total: ₦{selectedOrder.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              {!isReceiptMode && (
                <div className="p-8 bg-botanical-green/5 border-t border-botanical-green/5">
                  <div className="flex items-center gap-4 text-botanical-green/60 italic text-xs font-bold">
                    <Truck size={16} />
                    <span>Logistics Partner: Fez Delivery (Est. 2-3 Days)</span>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-[1200px] mx-auto">
        <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-botanical-green/10 pb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 bg-botanical-green rounded-full animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-botanical-green/40 font-bold">Verified Member</span>
            </div>
            <h1 className="font-serif text-4xl md:text-5xl text-botanical-green tracking-tighter">
              {userProfile?.full_name || "Loading..."}
            </h1>
            <p className="text-sm text-botanical-green/60 font-light mt-1">{userProfile?.email || "..."}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-8">
            <button onClick={() => setActiveTab("cart")} className={`flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-widest font-bold transition-all relative py-2 ${activeTab === 'cart' ? 'text-botanical-green' : 'text-botanical-green/30'}`}>
              Ledger ({cartItems.length}) {activeTab === 'cart' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-[2px] bg-botanical-green" />}
            </button>
            <button onClick={() => setActiveTab("tracking")} className={`flex items-center gap-2 text-[10px] md:text-[11px] uppercase tracking-widest font-bold transition-all relative py-2 ${activeTab === 'tracking' ? 'text-botanical-green' : 'text-botanical-green/30'}`}>
              Order History 
              {activeOrders.length > 0 && (
                <span className="bg-botanical-green text-clinical-white w-4 h-4 flex items-center justify-center rounded-full text-[8px]">
                  {activeOrders.length}
                </span>
              )}
              {activeTab === 'tracking' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-[2px] bg-botanical-green" />}
            </button>
            <button onClick={handleLogout} className="p-2 hover:bg-botanical-green/5 rounded-full transition-colors ml-auto md:ml-0"><LogOut size={18} className="text-botanical-green/20" /></button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16">
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeTab === "cart" ? (
                <motion.section key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  {cartItems.length === 0 && !isLoading && (
                    <div className="p-12 text-center border border-botanical-green/10 bg-clinical-white">
                      <p className="text-[10px] uppercase tracking-widest text-botanical-green/40 font-bold">Your ledger is empty.</p>
                    </div>
                  )}
                  {cartItems.map((item) => (
                    <div key={item.id} className="bg-clinical-white p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center border border-botanical-green/5 shadow-sm gap-6">
                      <div className="flex items-center gap-6 w-full sm:w-auto">
                        <div className="w-16 h-16 bg-botanical-green/5 rounded-sm flex items-center justify-center shrink-0"><ShoppingBag size={20} className="text-botanical-green/30" /></div>
                        <div>
                          <h3 className="font-serif text-xl md:text-2xl text-botanical-green">{item.name}</h3>
                          <p className="text-[10px] text-botanical-green/40 uppercase tracking-[0.2em] mt-1">Qty: {item.qty}</p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto border-t sm:border-0 pt-4 sm:pt-0">
                        <p className="font-sans text-lg md:text-xl text-botanical-green font-light">₦{(item.price * item.qty).toLocaleString()}</p>
                        <button onClick={() => handleRemoveFromCart(item.id)} className="text-[9px] uppercase tracking-widest text-red-800/40 hover:text-red-800 mt-1 transition-colors">Remove</button>
                      </div>
                    </div>
                  ))}
                </motion.section>
              ) : (
                <motion.section key="tracking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-botanical-green/40 mb-6 font-bold">Active Formulations</h2>
                    {activeOrders.length === 0 && <p className="text-xs text-botanical-green/40 italic">No active orders at this time.</p>}
                    {activeOrders.map((order) => (
                      <div key={order.id} className="bg-clinical-white p-6 md:p-10 border border-botanical-green/5 shadow-sm relative overflow-hidden mb-4">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] hidden sm:block"><Truck size={100} /></div>
                        <div className="flex flex-col gap-6 relative z-10">
                          <div className="flex justify-between items-start">
                            <div><span className="text-[10px] uppercase tracking-[0.4em] text-botanical-green/40 font-bold">{order.order_number}</span><h4 className="font-serif text-2xl md:text-3xl text-botanical-green mt-1">Formulating Extract</h4></div>
                            <div className="px-4 py-1.5 bg-botanical-green text-clinical-white rounded-full text-[9px] uppercase font-bold tracking-widest text-center">{order.status}</div>
                          </div>
                          <div className="flex items-center gap-6 text-[10px] text-botanical-green/60 uppercase tracking-widest border-t border-botanical-green/5 pt-6">
                            <span className="flex items-center gap-2"><Clock size={12}/> Registered {new Date(order.created_at).toLocaleDateString()}</span>
                            <button onClick={() => openTracking(order)} className="flex items-center gap-1 text-botanical-green font-bold hover:opacity-70 transition-opacity">Track Logs <ChevronRight size={12}/></button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <h2 className="text-[10px] uppercase tracking-[0.3em] text-botanical-green/40 mb-6 font-bold">Botanical History</h2>
                    {pastOrders.length === 0 && <p className="text-xs text-botanical-green/40 italic">No past orders found.</p>}
                    {pastOrders.map((order) => (
                      <div key={order.id} className="bg-white/40 p-5 flex flex-col sm:flex-row justify-between items-center border border-botanical-green/5 group hover:bg-white transition-all mb-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto"><Package size={16} className="text-botanical-green/30" /><div><p className="text-[10px] font-bold text-botanical-green/60">{order.order_number} — {new Date(order.created_at).toLocaleDateString()}</p><p className="text-xs text-botanical-green font-serif">Settlement: ₦{order.total_amount.toLocaleString()}</p></div></div>
                        {/* CHANGED to openReceipt logic */}
                        <button onClick={() => openReceipt(order)} className="mt-4 sm:mt-0 flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold bg-botanical-green/5 hover:bg-botanical-green hover:text-white px-5 py-2.5 rounded-full transition-all w-full sm:w-auto justify-center"><RefreshCw size={12} /> View Receipt</button>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-4">
            <div className="bg-botanical-green p-8 md:p-10 text-clinical-white rounded-sm shadow-2xl relative overflow-hidden lg:sticky lg:top-32">
              <Leaf className="absolute -bottom-10 -right-10 text-clinical-white/5 w-40 h-40" />
              <h3 className="font-serif text-3xl mb-8">Summary</h3>
              <div className="space-y-4 mb-10">
                <div className="flex justify-between text-sm opacity-60"><span>Subtotal</span><span>₦{cartSubtotal.toLocaleString()}</span></div>
                <div className="flex justify-between text-sm opacity-60"><span>Logistics</span><span className="text-[10px] uppercase">Checkout Calc</span></div>
                <div className="pt-6 border-t border-clinical-white/10 flex justify-between text-2xl font-serif"><span>Total</span><span>₦{cartSubtotal.toLocaleString()}</span></div>
              </div>
              <Link href="/checkout" className="w-full bg-clinical-white text-botanical-green py-5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-earth-silk transition-all shadow-xl">Proceed to Checkout <ArrowRight size={14} /></Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
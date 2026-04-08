"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, ChevronRight, Globe, MapPin, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Country, State } from "country-state-city";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const router = useRouter();
  
  // --- USER & CART STATE ---
  const [user, setUser] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true);
  
  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: ""
  });
  
  // --- LOCATION & SHIPPING STATE ---
  const [countries, setCountries] = useState<any[]>([]);
  const [availableStates, setAvailableStates] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [shippingFee, setShippingFee] = useState(0);

  // --- CHECKOUT PROCESS STATE ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 1. Initial Load: Fetch User, Cart, and Countries
  useEffect(() => {
    async function loadCheckoutData() {
      setCountries(Country.getAllCountries());

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/account"); // Redirect if not logged in
        return;
      }
      
      setUser(user);
      // Pre-fill email if we have it
      setFormData(prev => ({ ...prev, email: user.email || "" }));

      // Fetch cart items and join with product data
      const { data: cartData, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          product_id,
          products ( name, price, variants )
        `)
        .eq('user_id', user.id);

      if (cartData) {
        setCartItems(cartData);
      }
      setIsLoadingCart(false);
    }

    loadCheckoutData();
  }, [router]);

  // --- DYNAMIC SUBTOTAL CALCULATION ---
  const subtotal = cartItems.reduce((acc, item) => {
    // Uses variant price if it exists, otherwise base price
    const unitPrice = item.products.variants?.[0]?.price || item.products.price || 0;
    return acc + (unitPrice * item.quantity);
  }, 0);

  const totalSettlement = subtotal + shippingFee;

  // --- INPUT HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedCountry(code);
    setAvailableStates(State.getStatesOfCountry(code));
    setSelectedState(""); 
    
    if (code !== "NG" && code !== "") {
      setShippingFee(45000); // Fez International DHL Rate
    } else {
      setShippingFee(0);
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    setSelectedState(stateName);

    if (selectedCountry === "NG") {
      if (stateName === "Kwara") {
        setShippingFee(2000); 
      } else if (["Lagos", "Oyo", "Ogun", "Osun"].includes(stateName)) {
        setShippingFee(4500); 
      } else if (["Federal Capital Territory", "Kano", "Kaduna"].includes(stateName)) {
        setShippingFee(6000); 
      } else {
        setShippingFee(5000); 
      }
    }
  };

  // --- SUBMIT ORDER LOGIC ---
  const handleCheckout = async () => {
    setError("");

    // 1. Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !selectedCountry || !selectedState) {
      setError("Please fill out all delivery and contact fields securely.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your ledger is currently empty.");
      return;
    }

    setIsProcessing(true);

    try {
      // 2. Generate Unique Order Number (e.g. NCHM-847291)
      const orderNumber = `NCHM-${Math.floor(100000 + Math.random() * 900000)}`;

      // 3. Insert Main Order Record
      const { data: orderRecord, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          customer_name: `${formData.firstName} ${formData.lastName}`,
          customer_email: formData.email,
          customer_phone: formData.phone,
          shipping_address: `${formData.address}, ${formData.city}`,
          country: selectedCountry,
          state: selectedState,
          total_amount: totalSettlement,
          shipping_fee: shippingFee,
          status: 'Order Received',
          user_id: user.id
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 4. Format & Insert Order Items
      const itemsToInsert = cartItems.map(item => ({
        order_id: orderRecord.id,
        product_name: item.products.name,
        quantity: item.quantity,
        unit_price: item.products.variants?.[0]?.price || item.products.price || 0
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;

      // 5. Clear the Cart
      await supabase.from('cart_items').delete().eq('user_id', user.id);

      // 6. Show Success & Redirect
      setSuccess(true);
      setTimeout(() => {
        router.push("/account/ledger");
      }, 3000);

    } catch (err: any) {
      console.error(err);
      setError("Order processing failed. Please try again or contact support.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoadingCart) {
    return <main className="min-h-screen bg-earth-silk flex justify-center items-center"><Loader2 size={40} className="animate-spin text-botanical-green/40" /></main>;
  }

  return (
    <main className="min-h-screen bg-earth-silk pt-32 pb-20 relative">

      {/* SUCCESS MODAL */}
      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-botanical-green/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-clinical-white p-12 max-w-md w-full text-center shadow-2xl border border-botanical-green/10">
              <CheckCircle2 size={64} className="text-botanical-green mx-auto mb-6" />
              <h2 className="font-serif text-3xl text-botanical-green mb-4">Order Secured</h2>
              <p className="text-sm text-botanical-green/60 mb-8 leading-relaxed">
                Your remedies are being prepared by the apothecary. We are redirecting you to your ledger...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left: Shipping & Secure Payment */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 text-botanical-green/40 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest">Checkout</span>
            <ChevronRight size={14} />
            <span className="text-xs font-bold uppercase tracking-widest opacity-20">Payment</span>
          </div>

          <h2 className="font-serif text-4xl text-botanical-green mb-12">Delivery Logistics</h2>
          
          {error && (
            <div className="bg-red-50 text-red-800 p-4 mb-8 text-xs font-bold uppercase tracking-widest border border-red-100 flex items-center gap-3">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email Address" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
            </div>
            
            <div className="space-y-6">
              <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Delivery Address" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              
              <div className="relative border-b border-botanical-green/20 py-1">
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-botanical-green/60 font-bold mb-1"><Globe size={12}/> Country</div>
                <select value={selectedCountry} onChange={handleCountryChange} className="w-full bg-transparent py-2 outline-none focus:border-botanical-green appearance-none text-botanical-green font-serif cursor-pointer">
                  <option value="" disabled>Select Country...</option>
                  {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                </select>
              </div>

              <div className="relative border-b border-botanical-green/20 py-1">
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-botanical-green/60 font-bold mb-1"><MapPin size={12}/> State / Province</div>
                <select value={selectedState} onChange={handleStateChange} disabled={!selectedCountry} className="w-full bg-transparent py-2 outline-none focus:border-botanical-green appearance-none text-botanical-green font-serif cursor-pointer disabled:opacity-30">
                  <option value="" disabled>Select State...</option>
                  {availableStates.map(s => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="p-8 bg-botanical-green/5 border border-botanical-green/10 rounded-sm mt-12">
            <div className="flex items-center gap-3 text-botanical-green mb-6">
              <ShieldCheck size={20} />
              <h3 className="font-serif text-xl">Encrypted Settlement</h3>
            </div>
            <p className="text-xs text-botanical-green/50 mb-8 leading-relaxed">
              Your transaction is secured by clinical-grade encryption protocol.
            </p>
            <button 
              onClick={handleCheckout}
              disabled={isProcessing || cartItems.length === 0}
              className="w-full flex justify-center items-center gap-3 bg-botanical-green text-clinical-white py-5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-botanical-green/90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : null}
              {isProcessing ? "Processing Ledger..." : `Finalize Order — ₦${totalSettlement.toLocaleString()}`}
            </button>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32 bg-clinical-white p-8 border border-botanical-green/10 shadow-sm">
            <h3 className="font-serif text-2xl text-botanical-green mb-8">Summary</h3>
            
            <div className="space-y-6 border-b border-botanical-green/10 pb-8 mb-8 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.length === 0 ? (
                <p className="text-sm text-botanical-green/50 font-light italic">Your ledger is empty.</p>
              ) : (
                cartItems.map((item) => {
                  const itemPrice = item.products.variants?.[0]?.price || item.products.price || 0;
                  return (
                    <div key={item.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-botanical-green">{item.products.name}</p>
                        <p className="text-[10px] uppercase text-botanical-green/40">Quantity: {item.quantity < 10 ? `0${item.quantity}` : item.quantity}</p>
                      </div>
                      <p className="text-sm text-botanical-green">₦{(itemPrice * item.quantity).toLocaleString()}</p>
                    </div>
                  );
                })
              )}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs text-botanical-green/60">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-botanical-green/60">
                <span className="flex items-center gap-2"><Truck size={14}/> Fez Logistics</span>
                <span>
                  {shippingFee === 0 && !selectedCountry ? "Calculated at checkout" : `₦${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-xl font-serif text-botanical-green pt-4 border-t border-botanical-green/10">
                <span>Total Settlement</span>
                <span>₦{totalSettlement.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

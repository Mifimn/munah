"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Truck, ChevronRight, Globe, MapPin, Loader2, CheckCircle2, AlertCircle, CreditCard, Navigation } from "lucide-react";
import { Country, State } from "country-state-city";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { usePaystackPayment } from "react-paystack"; 

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
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // --- CHECKOUT PROCESS STATE ---
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // 1. Initial Load
  useEffect(() => {
    console.log("🌿 Natural Cure Checkout Initialized! Console is actively listening...");

    async function loadCheckoutData() {
      setCountries(Country.getAllCountries());

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("⚠️ No user found, redirecting to account page.");
        router.push("/account"); 
        return;
      }
      
      setUser(user);
      setFormData(prev => ({ ...prev, email: user.email || "" }));

      const { data: cartData } = await supabase
        .from('cart_items')
        .select(`
          id,
          quantity,
          variant_size,
          product_id,
          products ( name, price, variants )
        `)
        .eq('user_id', user.id);

      if (cartData) {
        console.log("🛒 Cart Data Loaded:", cartData);
        setCartItems(cartData);
      }
      setIsLoadingCart(false);
    }

    loadCheckoutData();
  }, [router]);

  // --- DYNAMIC TOTALS ---
  const subtotal = cartItems.reduce((acc, item) => {
    let unitPrice = item.products?.price || 0;
    if (item.variant_size && item.products?.variants) {
      const matchedVariant = item.products.variants.find(
        (v: any) => v.size === item.variant_size
      );
      if (matchedVariant) {
        unitPrice = parseFloat(matchedVariant.price);
      }
    }
    return acc + (unitPrice * item.quantity);
  }, 0);

  const calculatePaystackFee = (baseAmount: number, isInternational: boolean) => {
    if (baseAmount === 0) return 0;
    let fee = 0;
    if (isInternational) {
      fee = ((baseAmount + 100) / 0.961) - baseAmount;
    } else {
      if (baseAmount < 2500) {
        fee = (baseAmount / 0.985) - baseAmount;
      } else {
        fee = ((baseAmount + 100) / 0.985) - baseAmount;
      }
      if (fee > 2000) fee = 2000;
    }
    return Math.ceil(fee); 
  };

  const isIntl = selectedCountry !== "NG" && selectedCountry !== "";
  const baseTotal = subtotal + shippingFee;
  const paystackFee = calculatePaystackFee(baseTotal, isIntl);
  const finalTotalSettlement = baseTotal + paystackFee;

  // --- PAYSTACK CONFIGURATION ---
  const config = {
    reference: `NCHM-${new Date().getTime().toString()}`, 
    email: formData.email,
    amount: finalTotalSettlement * 100, 
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
    metadata: {
      custom_fields: [
        {
          display_name: "Customer Name",
          variable_name: "customer_name",
          value: `${formData.firstName} ${formData.lastName}`
        },
        {
          display_name: "Phone Number",
          variable_name: "phone_number",
          value: formData.phone
        }
      ]
    }
  };

  const initializePayment = usePaystackPayment(config);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- GPS AUTO-LOCATOR ---
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Free reverse geocoding API to turn coordinates into a street address
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          
          if (data && data.display_name) {
            setFormData(prev => ({
              ...prev,
              address: data.display_name,
              city: data.address?.city || data.address?.town || data.address?.state_district || ""
            }));
          }
        } catch (err) {
          console.error("Could not fetch address details", err);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("GPS Error:", error);
        setError("Could not get your location. Please type it manually.");
        setIsLocating(false);
      }
    );
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedCountry(code);
    setAvailableStates(State.getStatesOfCountry(code));
    setSelectedState(""); 
    
    if (code !== "NG" && code !== "") {
      setShippingFee(45000); 
    } else {
      setShippingFee(0);
    }
  };

  // --- SHIPBUBBLE LIVE PRICING LOGIC ---
  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    setSelectedState(stateName);

    console.log(`📍 State Selected: ${stateName}. Initializing Shipbubble API Call...`);

    if (selectedCountry === "NG") {
      setIsCalculatingShipping(true);
      
      try {
        const payload = { 
          state: stateName, 
          city: formData.city || stateName,
          name: `${formData.firstName} ${formData.lastName}`.trim() || "Modina Customer",
          email: formData.email || "customer@modina.com",
          phone: formData.phone || "+2348000000000",
          address: formData.address || `${stateName} Central`
        };

        const response = await fetch('/api/shipping', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const data = await response.json();
        
        if (data.success && data.fee) {
          console.log(`✅ Success! Live Rate applied: ₦${data.fee}`);
          // Math.ceil rounds the price up so we don't show half-naira
          setShippingFee(Math.ceil(data.fee)); 
        } else {
          throw new Error(data.error || "Live rate failed.");
        }
        
      } catch (err) {
        console.error("❌ API Error. Falling back to Database...");
        const { data: dbZone } = await supabase
          .from('shipping_zones')
          .select('fee')
          .contains('states', [stateName])
          .eq('status', 'Active')
          .maybeSingle();
          
        if (dbZone) {
          setShippingFee(dbZone.fee);
        } else {
          setShippingFee(5000); 
        }
      } finally {
        setIsCalculatingShipping(false);
      }
    }
  };

  const onSuccess = async (reference: any) => { /* Handle order creation in DB here */ };
  const onClose = () => { setIsProcessing(false); };

  const handleCheckoutClick = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !selectedCountry || !selectedState) {
      setError("Please fill out all delivery and contact fields securely.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your ledger is currently empty.");
      return;
    }

    setIsProcessing(true);
    initializePayment({ onSuccess, onClose });
  };

  if (isLoadingCart) {
    return <main className="min-h-screen bg-earth-silk flex justify-center items-center"><Loader2 size={40} className="animate-spin text-botanical-green/40" /></main>;
  }

  return (
    <main className="min-h-screen bg-earth-silk pt-32 pb-20 relative">

      <AnimatePresence>
        {success && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-botanical-green/40 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-clinical-white p-12 max-w-md w-full text-center shadow-2xl border border-botanical-green/10">
              <CheckCircle2 size={64} className="text-botanical-green mx-auto mb-6" />
              <h2 className="font-serif text-3xl text-botanical-green mb-4">Payment Secured</h2>
              <p className="text-sm text-botanical-green/60 mb-8 leading-relaxed">
                Your remedies are being prepared by the apothecary...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
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
              {/* GPS AUTO-LOCATOR BUTTON ADDED HERE */}
              <div className="relative">
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="Delivery Address" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green pr-10" />
                <button 
                  onClick={handleGetLocation} 
                  type="button"
                  title="Use my current location"
                  className="absolute right-0 top-3 text-botanical-green hover:opacity-70 transition-opacity"
                >
                  {isLocating ? <Loader2 size={20} className="animate-spin" /> : <Navigation size={20} />}
                </button>
              </div>

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
            <button 
              onClick={handleCheckoutClick}
              disabled={isProcessing || isCalculatingShipping || cartItems.length === 0}
              className="w-full flex justify-center items-center gap-3 bg-botanical-green text-clinical-white py-5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-botanical-green/90 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : null}
              {isProcessing ? "Connecting to Bank..." : `Pay Securely — ₦${finalTotalSettlement.toLocaleString()}`}
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32 bg-clinical-white p-8 border border-botanical-green/10 shadow-sm">
            <h3 className="font-serif text-2xl text-botanical-green mb-8">Summary</h3>
            
            <div className="space-y-6 border-b border-botanical-green/10 pb-8 mb-8 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-botanical-green">{item.products.name}</p>
                    <p className="text-[10px] uppercase text-botanical-green/40 mt-0.5">Size: {item.variant_size || 'Standard'}</p>
                  </div>
                  <p className="text-sm text-botanical-green">₦{((item.products?.price || 0) * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-xs text-botanical-green/60">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-botanical-green/60">
                <span className="flex items-center gap-2"><Truck size={14}/> Logistics Fee</span>
                <span>
                  {isCalculatingShipping ? (
                    <span className="flex items-center gap-1"><Loader2 size={10} className="animate-spin" /> Fetching Rate...</span>
                  ) : (
                    `₦${shippingFee.toLocaleString()}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-xs text-botanical-green/60 border-b border-botanical-green/5 pb-4">
                <span className="flex items-center gap-2"><CreditCard size={14}/> Gateway Fee</span>
                <span>₦{paystackFee.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-xl font-serif text-botanical-green pt-2">
                <span>Total Settlement</span>
                <span>₦{finalTotalSettlement.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

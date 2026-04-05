"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, ChevronRight, Globe, MapPin } from "lucide-react";
import { Country, State } from "country-state-city";

export default function CheckoutPage() {
  // --- MOCK CART DATA ---
  const subtotal = 45000; 

  // --- LOCATION & SHIPPING STATE ---
  const [countries, setCountries] = useState<any[]>([]);
  const [availableStates, setAvailableStates] = useState<any[]>([]);
  
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [shippingFee, setShippingFee] = useState(0);

  // 1. Load all countries when page opens
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // 2. When customer selects a country
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedCountry(code);
    
    // Instantly load the correct states for that country
    setAvailableStates(State.getStatesOfCountry(code));
    setSelectedState(""); // Reset state
    
    // If international, instantly apply flat rate. If Nigeria, wait for state selection.
    if (code !== "NG" && code !== "") {
      setShippingFee(45000); // Fez International DHL Rate
    } else {
      setShippingFee(0);
    }
  };

  // 3. When customer selects a state (For Nigeria zones)
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    setSelectedState(stateName);

    if (selectedCountry === "NG") {
      // Apply Modina's Fez Delivery Zones
      if (stateName === "Kwara") {
        setShippingFee(2000); // Local Dispatch
      } else if (["Lagos", "Oyo", "Ogun", "Osun"].includes(stateName)) {
        setShippingFee(4500); // South West Hub
      } else if (["Federal Capital Territory", "Kano", "Kaduna"].includes(stateName)) {
        setShippingFee(6000); // Northern Hub
      } else {
        setShippingFee(5000); // Standard National Flat Rate
      }
    }
  };

  const totalSettlement = subtotal + shippingFee;

  return (
    <main className="min-h-screen bg-earth-silk pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Left: Shipping & Secure Payment (8 Cols) */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 text-botanical-green/40 mb-8">
            <span className="text-xs font-bold uppercase tracking-widest">Checkout</span>
            <ChevronRight size={14} />
            <span className="text-xs font-bold uppercase tracking-widest opacity-20">Payment</span>
          </div>

          <h2 className="font-serif text-4xl text-botanical-green mb-12">Delivery Logistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="space-y-6">
              <input type="text" placeholder="First Name" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              <input type="text" placeholder="Last Name" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              <input type="text" placeholder="Delivery Address" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
            </div>
            
            <div className="space-y-6">
              <input type="text" placeholder="City" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              
              {/* DYNAMIC COUNTRY DROPDOWN */}
              <div className="relative border-b border-botanical-green/20 py-1">
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-botanical-green/60 font-bold mb-1"><Globe size={12}/> Country</div>
                <select 
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="w-full bg-transparent py-2 outline-none focus:border-botanical-green appearance-none text-botanical-green font-serif cursor-pointer"
                >
                  <option value="" disabled>Select Country...</option>
                  {countries.map(c => (
                    <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* DYNAMIC STATE DROPDOWN */}
              <div className="relative border-b border-botanical-green/20 py-1">
                <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-botanical-green/60 font-bold mb-1"><MapPin size={12}/> State / Province</div>
                <select 
                  value={selectedState}
                  onChange={handleStateChange}
                  disabled={!selectedCountry}
                  className="w-full bg-transparent py-2 outline-none focus:border-botanical-green appearance-none text-botanical-green font-serif cursor-pointer disabled:opacity-30"
                >
                  <option value="" disabled>Select State...</option>
                  {availableStates.map(s => (
                    <option key={s.isoCode} value={s.name}>{s.name}</option>
                  ))}
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
            <button className="w-full bg-botanical-green text-clinical-white py-5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-botanical-green/90 transition-all active:scale-[0.98]">
              Finalize Order — ₦{totalSettlement.toLocaleString()}
            </button>
          </div>
        </div>

        {/* Right: Order Summary (5 Cols) - Sticky */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32 bg-clinical-white p-8 border border-botanical-green/10 shadow-sm">
            <h3 className="font-serif text-2xl text-botanical-green mb-8">Summary</h3>
            <div className="space-y-6 border-b border-botanical-green/10 pb-8 mb-8">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-botanical-green">Immunity Elixir</p>
                  <p className="text-[10px] uppercase text-botanical-green/40">Quantity: 01</p>
                </div>
                <p className="text-sm text-botanical-green">₦{subtotal.toLocaleString()}</p>
              </div>
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

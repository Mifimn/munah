"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Boxes, ListOrdered, Settings, Plus, 
  X, ShieldCheck, FileText, Truck, Map, Edit3, Trash2, Globe, MapPin 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Country, State } from "country-state-city";

export default function LogisticsManager() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname() || "/admin/logistics";

  // --- COUNTRY / STATE LOGIC ---
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [availableStates, setAvailableStates] = useState<any[]>([]);
  
  // Zone Form State
  const [zoneName, setZoneName] = useState("");
  const [applyToWholeCountry, setApplyToWholeCountry] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [flatRate, setFlatRate] = useState("");

  useEffect(() => {
    // Load all countries when component mounts
    setCountries(Country.getAllCountries());
  }, []);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedCountryCode(code);
    setAvailableStates(State.getStatesOfCountry(code));
    setSelectedStates([]); // Reset states if country changes
  };

  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    if (stateName && !selectedStates.includes(stateName)) {
      setSelectedStates([...selectedStates, stateName]);
    }
  };

  const removeState = (stateToRemove: string) => {
    setSelectedStates(selectedStates.filter(s => s !== stateToRemove));
  };

  // --- MOCK ZONE DATA ---
  const [zones, setZones] = useState([
    { id: "Z-01", name: "Local Dispatch", regions: "Kwara State (Offa, Ilorin)", fee: 2000, status: "Active" },
    { id: "Z-02", name: "South West", regions: "Lagos, Oyo, Ogun, Osun", fee: 4500, status: "Active" },
    { id: "Z-03", name: "Northern Hub", regions: "Abuja, Kano, Kaduna", fee: 6000, status: "Active" },
    { id: "Z-04", name: "International (DHL via Fez)", regions: "United States (All States)", fee: 45000, status: "Active" },
  ]);

  return (
    <main className="min-h-screen bg-earth-silk flex flex-col lg:flex-row">
      
      {/* --- 1. DESKTOP SIDEBAR --- */}
      <aside className="w-[280px] bg-botanical-green fixed h-full z-20 hidden lg:flex flex-col">
        <div className="p-8 border-b border-clinical-white/10">
          <div className="flex items-center gap-2 mb-2"><ShieldCheck size={16} className="text-clinical-white/50" /><span className="text-[10px] uppercase tracking-[0.3em] text-clinical-white/50 font-bold">Secure Portal</span></div>
          <h1 className="font-serif text-2xl text-clinical-white">Command Center</h1>
          <p className="text-xs text-clinical-white/40 font-light mt-1">Admin: Modina Olagunju</p>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          <Link href="/admin" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname === "/admin" ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}><LayoutDashboard size={16} /> Overview</Link>
          <Link href="/admin/inventory" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname.includes("/admin/inventory") ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}><Boxes size={16} /> Inventory</Link>
          <Link href="/admin/orders" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname.includes("/admin/orders") ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}><ListOrdered size={16} /> Order Ledger</Link>
          <Link href="/admin/articles" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname.includes("/admin/articles") ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}><FileText size={16} /> Articles</Link>
        </nav>

        <div className="p-8 border-t border-clinical-white/10">
          <Link href="/admin/logistics" className={`flex items-center gap-4 transition-colors text-xs uppercase tracking-widest font-bold ${pathname.includes("/admin/logistics") ? "text-clinical-white" : "text-clinical-white/30 hover:text-clinical-white"}`}>
            <Truck size={16} /> Logistics Config
          </Link>
        </div>
      </aside>

      {/* --- 2. MOBILE NAVIGATION --- */}
      <div className="lg:hidden bg-botanical-green w-full sticky top-0 z-20 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-clinical-white/10">
          <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-clinical-white/50" /><h1 className="font-serif text-lg text-clinical-white">Admin Portal</h1></div>
        </div>
        <nav className="flex overflow-x-auto no-scrollbar px-4 py-3 gap-2">
          <Link href="/admin" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname === "/admin" ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Overview</Link>
          <Link href="/admin/inventory" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname.includes("/admin/inventory") ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Inventory</Link>
          <Link href="/admin/orders" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname.includes("/admin/orders") ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Orders</Link>
          <Link href="/admin/articles" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname.includes("/admin/articles") ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Articles</Link>
          <Link href="/admin/logistics" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname.includes("/admin/logistics") ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Logistics</Link>
        </nav>
      </div>

      {/* --- 3. ZONE EDITOR DRAWER --- */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-botanical-green/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-clinical-white z-[110] shadow-2xl flex flex-col">
              
              <div className="p-6 md:p-8 border-b border-botanical-green/10 flex justify-between items-center bg-earth-silk/50">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-botanical-green/40 font-bold">Fez Delivery Config</p>
                  <h2 className="font-serif text-xl md:text-2xl text-botanical-green">Configure Shipping Zone</h2>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-3 bg-botanical-green/5 rounded-full text-botanical-green hover:bg-botanical-green hover:text-white transition-all"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                
                {/* Zone Name */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Zone Title</label>
                  <input type="text" placeholder="e.g. South West Region" value={zoneName} onChange={(e) => setZoneName(e.target.value)} className="w-full mt-2 border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green bg-transparent text-xl font-serif text-botanical-green" />
                </div>
                
                {/* Dynamic Country Selector */}
                <div className="p-6 bg-botanical-green/5 border border-botanical-green/10 rounded-sm space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2"><Globe size={14} /> Select Country</label>
                    <select 
                      value={selectedCountryCode}
                      onChange={handleCountryChange}
                      className="w-full mt-2 border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green appearance-none cursor-pointer font-bold"
                    >
                      <option value="" disabled>Choose a country...</option>
                      {countries.map(country => (
                        <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Show State logic ONLY if a country is selected */}
                  {selectedCountryCode && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      
                      {/* Checkbox Toggle */}
                      <label className="flex items-center gap-3 cursor-pointer mb-4">
                        <input 
                          type="checkbox" 
                          checked={applyToWholeCountry}
                          onChange={(e) => setApplyToWholeCountry(e.target.checked)}
                          className="w-4 h-4 accent-botanical-green"
                        />
                        <span className="text-xs text-botanical-green font-bold">Apply flat rate to entire country</span>
                      </label>

                      {/* State Selector (Hidden if applied to whole country) */}
                      {!applyToWholeCountry && (
                        <div className="mt-6 border-t border-botanical-green/10 pt-6">
                          <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2 mb-2"><MapPin size={14}/> Target Specific States/Regions</label>
                          <select 
                            onChange={handleStateSelect}
                            value="" // Always reset to empty so they can pick multiple
                            className="w-full border-b border-botanical-green/20 py-2 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green appearance-none cursor-pointer mb-4"
                          >
                            <option value="" disabled>Select states to add...</option>
                            {availableStates.map(state => (
                              <option key={state.isoCode} value={state.name}>{state.name}</option>
                            ))}
                          </select>
                          
                          {/* Selected State Pills */}
                          <div className="flex flex-wrap gap-2">
                            {selectedStates.map(state => (
                              <span key={state} className="flex items-center gap-2 bg-clinical-white border border-botanical-green/20 text-botanical-green px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                {state} <button onClick={() => removeState(state)}><X size={12} className="hover:text-red-800" /></button>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Flat Rate Fee */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Flat Rate Shipping Fee (₦)</label>
                  <input type="number" placeholder="e.g. 4500" value={flatRate} onChange={(e) => setFlatRate(e.target.value)} className="w-full mt-2 border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green bg-transparent text-xl font-sans text-botanical-green" />
                </div>
              </div>

              <div className="p-6 md:p-8 bg-earth-silk border-t border-botanical-green/10">
                <button className="w-full bg-botanical-green text-clinical-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-botanical-green/90 transition-all">
                  Save Zone Pricing
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- 4. MAIN CANVAS --- */}
      <div className="flex-1 lg:ml-[280px] p-4 sm:p-6 md:p-12 w-full overflow-hidden">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-12 border-b border-botanical-green/10 pb-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-botanical-green tracking-tighter">Logistics & Zones</h2>
            <p className="text-xs md:text-sm text-botanical-green/50 mt-2">Manage Fez Delivery rates and geographic limits.</p>
          </div>
          <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 bg-botanical-green text-clinical-white px-6 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:bg-botanical-green/90 transition-all w-full sm:w-auto justify-center">
            <Plus size={14} /> Add New Zone
          </button>
        </header>

        {/* Fez Partner Card */}
        <div className="mb-12 p-8 bg-clinical-white border border-botanical-green/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-botanical-green/5 flex items-center justify-center rounded-sm">
              <Truck size={24} className="text-botanical-green" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-botanical-green/40 font-bold mb-1">Active Partner</p>
              <h3 className="font-serif text-2xl text-botanical-green">Fez Delivery / Logistics</h3>
            </div>
          </div>
          <div className="bg-botanical-green/10 text-botanical-green px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full">
            System Online
          </div>
        </div>

        {/* --- SHIPPING ZONES TABLE --- */}
        <div className="bg-clinical-white border border-botanical-green/5 shadow-sm rounded-sm overflow-hidden w-full">
          <div className="p-4 md:p-6 border-b border-botanical-green/5 bg-earth-silk/30 flex items-center gap-2">
            <Map size={16} className="text-botanical-green/40" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-botanical-green/60">Configured Geographic Zones</span>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-botanical-green/10 text-[10px] uppercase tracking-widest text-botanical-green/40">
                  <th className="p-4 md:p-6 font-bold whitespace-nowrap">Zone Name</th>
                  <th className="p-4 md:p-6 font-bold whitespace-nowrap">Regions Covered</th>
                  <th className="p-4 md:p-6 font-bold whitespace-nowrap">Fez Rate</th>
                  <th className="p-4 md:p-6 font-bold text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((zone, index) => (
                  <tr key={index} className="border-b border-botanical-green/5 hover:bg-earth-silk/20 transition-colors group">
                    <td className="p-4 md:p-6 font-serif text-base md:text-lg text-botanical-green whitespace-nowrap">{zone.name}</td>
                    <td className="p-4 md:p-6 text-xs text-botanical-green/60 max-w-[250px] truncate">{zone.regions}</td>
                    <td className="p-4 md:p-6 font-sans text-sm text-botanical-green whitespace-nowrap font-bold">₦{zone.fee.toLocaleString()}</td>
                    <td className="p-4 md:p-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setIsDrawerOpen(true)} className="p-2 bg-botanical-green/5 hover:bg-botanical-green/10 rounded-full text-botanical-green transition-colors"><Edit3 size={14} /></button>
                        <button className="p-2 bg-red-800/5 hover:bg-red-800/10 rounded-full text-red-800 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}

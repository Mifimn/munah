"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, X, ShieldCheck, Truck, Map, Edit3, Trash2, 
  Globe, MapPin, Loader2, ArrowLeft, AlertTriangle 
} from "lucide-react";
import Link from "next/link";
import { Country, State } from "country-state-city";
import { supabase } from "@/lib/supabase";

export default function LogisticsManager() {
  // --- UI STATES ---
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // --- DATABASE STATE ---
  const [zones, setZones] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // --- FORM STATE ---
  const [countries, setCountries] = useState<any[]>([]);
  const [selectedCountryCode, setSelectedCountryCode] = useState("");
  const [availableStates, setAvailableStates] = useState<any[]>([]);
  
  const [zoneName, setZoneName] = useState("");
  const [applyToWholeCountry, setApplyToWholeCountry] = useState(false);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [flatRate, setFlatRate] = useState("");

  useEffect(() => {
    setCountries(Country.getAllCountries());
    fetchZones();
  }, []);

  async function fetchZones() {
    setIsLoading(true);
    const { data } = await supabase.from('shipping_zones').select('*').order('created_at', { ascending: false });
    if (data) setZones(data);
    setIsLoading(false);
  }

  // --- HANDLERS ---
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value;
    setSelectedCountryCode(code);
    setAvailableStates(State.getStatesOfCountry(code));
    setSelectedStates([]);
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

  const handleEdit = (zone: any) => {
    setEditingId(zone.id);
    setZoneName(zone.name);
    setSelectedCountryCode(zone.country_code);
    setAvailableStates(State.getStatesOfCountry(zone.country_code));
    setApplyToWholeCountry(zone.apply_to_whole_country);
    setSelectedStates(zone.states || []);
    setFlatRate(zone.fee.toString());
    setIsDrawerOpen(true);
  };

  const handleSaveZone = async () => {
    if (!zoneName || !flatRate || !selectedCountryCode) return;
    
    setIsSaving(true);
    const payload = {
      name: zoneName,
      country_code: selectedCountryCode,
      apply_to_whole_country: applyToWholeCountry,
      states: applyToWholeCountry ? [] : selectedStates,
      fee: parseFloat(flatRate),
    };

    let error;
    if (editingId) {
      const { error: err } = await supabase.from('shipping_zones').update(payload).eq('id', editingId);
      error = err;
    } else {
      const { error: err } = await supabase.from('shipping_zones').insert([payload]);
      error = err;
    }

    if (!error) {
      setIsDrawerOpen(false);
      resetForm();
      fetchZones();
    }
    setIsSaving(false);
  };

  const handleDeleteZone = async () => {
    if (!deleteConfirm) return;
    const { error } = await supabase.from('shipping_zones').delete().eq('id', deleteConfirm);
    if (!error) fetchZones();
    setDeleteConfirm(null);
  };

  const resetForm = () => {
    setEditingId(null);
    setZoneName("");
    setSelectedCountryCode("");
    setApplyToWholeCountry(false);
    setSelectedStates([]);
    setFlatRate("");
  };

  return (
    <main className="min-h-screen bg-earth-silk relative">
      
      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-botanical-green/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-clinical-white p-8 max-w-sm w-full text-center shadow-2xl">
              <AlertTriangle size={48} className="text-red-800 mx-auto mb-4" />
              <h3 className="font-serif text-2xl text-botanical-green mb-2">Delete Zone?</h3>
              <p className="text-sm text-botanical-green/60 mb-8 leading-relaxed">This action is permanent. All associated shipping logic for this region will be removed.</p>
              <div className="flex gap-4">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 border border-botanical-green/20 text-[10px] font-bold uppercase tracking-widest text-botanical-green">Cancel</button>
                <button onClick={handleDeleteZone} className="flex-1 py-3 bg-red-800 text-clinical-white text-[10px] font-bold uppercase tracking-widest">Confirm Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ZONE EDITOR DRAWER --- */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-botanical-green/60 backdrop-blur-sm z-[130]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-clinical-white z-[140] shadow-2xl flex flex-col">
              <div className="p-6 border-b border-botanical-green/10 flex justify-between items-center bg-earth-silk/50">
                <div><h2 className="font-serif text-2xl text-botanical-green">{editingId ? "Edit Zone" : "New Zone"}</h2></div>
                <button onClick={() => { setIsDrawerOpen(false); resetForm(); }}><X size={20} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Zone Title</label>
                  <input type="text" value={zoneName} onChange={(e) => setZoneName(e.target.value)} className="w-full mt-2 border-b border-botanical-green/20 py-3 outline-none text-xl font-serif text-botanical-green" placeholder="e.g. Lagos Metro" />
                </div>
                <div className="p-6 bg-botanical-green/5 border border-botanical-green/10 space-y-6">
                  <select value={selectedCountryCode} onChange={handleCountryChange} className="w-full bg-transparent text-sm border-b border-botanical-green/20 py-3 outline-none text-botanical-green font-bold">
                    <option value="">Select Country...</option>
                    {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
                  </select>
                  {selectedCountryCode && (
                    <div className="space-y-4">
                      <label className="flex items-center gap-3"><input type="checkbox" checked={applyToWholeCountry} onChange={(e) => setApplyToWholeCountry(e.target.checked)} className="accent-botanical-green" /><span className="text-xs font-bold text-botanical-green uppercase">Entire Country</span></label>
                      {!applyToWholeCountry && (
                        <div>
                          <select onChange={handleStateSelect} value="" className="w-full border-b border-botanical-green/20 py-2 outline-none bg-transparent text-sm mb-4">
                            <option value="">Add Region/State...</option>
                            {availableStates.map(s => <option key={s.isoCode} value={s.name}>{s.name}</option>)}
                          </select>
                          <div className="flex flex-wrap gap-2">{selectedStates.map(s => <span key={s} className="bg-clinical-white border border-botanical-green/20 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-2 uppercase tracking-tighter">{s} <button onClick={() => removeState(s)}><X size={12} /></button></span>)}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Flat Rate (₦)</label>
                  <input type="number" value={flatRate} onChange={(e) => setFlatRate(e.target.value)} className="w-full mt-2 border-b border-botanical-green/20 py-3 outline-none text-xl font-sans text-botanical-green" placeholder="4500" />
                </div>
              </div>
              <div className="p-8 border-t border-botanical-green/10">
                <button onClick={handleSaveZone} disabled={isSaving} className="w-full bg-botanical-green text-clinical-white py-4 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {isSaving ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Save Zone Pricing"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT CANVAS --- */}
      <div className="max-w-[1200px] mx-auto p-4 sm:p-8 md:p-16 w-full">
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-botanical-green/10 pb-10">
          <div className="space-y-6">
            <Link href="/admin" className="inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-botanical-green/40 hover:text-botanical-green transition-colors group">
              <div className="p-2 rounded-full border border-botanical-green/10 group-hover:bg-botanical-green/5">
                <ArrowLeft size={14} /> 
              </div>
              Return to Overview
            </Link>
            <div>
              <div className="flex items-center gap-2 mb-2 text-botanical-green/40">
                <ShieldCheck size={16} />
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Secure Logistics Portal</span>
              </div>
              <h2 className="font-serif text-4xl sm:text-5xl text-botanical-green tracking-tighter leading-none">Logistics Manager</h2>
              <p className="text-sm text-botanical-green/50 mt-4 max-w-md leading-relaxed">Configure Fez Delivery zones, geographic boundaries, and regional flat-rate pricing.</p>
            </div>
          </div>
          
          <button 
            onClick={() => { resetForm(); setIsDrawerOpen(true); }} 
            className="w-full md:w-auto bg-botanical-green text-clinical-white px-10 py-5 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-2xl flex items-center justify-center gap-3 hover:bg-botanical-green/90 transition-all"
          >
            <Plus size={16} /> New Shipping Zone
          </button>
        </header>

        {/* --- SHIPPING ZONES TABLE --- */}
        <div className="bg-clinical-white border border-botanical-green/5 shadow-sm rounded-sm overflow-hidden w-full">
          {isLoading ? (
            <div className="p-32 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-botanical-green/20" size={48} />
              <p className="text-[10px] uppercase tracking-widest font-bold text-botanical-green/30">Fetching Geographic Ledger...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-botanical-green/10 text-[10px] uppercase tracking-widest text-botanical-green/40 bg-earth-silk/30">
                    <th className="p-8 font-bold">Zone Designation</th>
                    <th className="p-8 font-bold">Geographic Coverage</th>
                    <th className="p-8 font-bold">Fez Flat Rate</th>
                    <th className="p-8 font-bold text-right whitespace-nowrap">Clinical Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {zones.map((zone) => (
                    <tr key={zone.id} className="border-b border-botanical-green/5 hover:bg-earth-silk/20 transition-colors group">
                      <td className="p-8 font-serif text-xl text-botanical-green">
                        {zone.name}
                      </td>
                      <td className="p-8">
                        <span className="text-xs text-botanical-green/60 leading-relaxed block max-w-[250px]">
                          {zone.apply_to_whole_country ? `${zone.country_code} (National)` : zone.states.join(", ")}
                        </span>
                      </td>
                      <td className="p-8 font-sans text-base text-botanical-green font-bold">
                        ₦{zone.fee.toLocaleString()}
                      </td>
                      <td className="p-8 text-right">
                        <div className="flex justify-end gap-3 sm:opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => handleEdit(zone)} 
                            className="p-3 bg-botanical-green/5 text-botanical-green rounded-full hover:bg-botanical-green hover:text-white transition-all shadow-sm"
                            title="Edit Zone"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            onClick={() => setDeleteConfirm(zone.id)} 
                            className="p-3 bg-red-800/5 text-red-800 rounded-full hover:bg-red-800 hover:text-white transition-all shadow-sm"
                            title="Delete Zone"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {zones.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-32 text-center">
                        <Map className="mx-auto text-botanical-green/10 mb-6" size={48} />
                        <p className="text-[10px] uppercase tracking-widest font-bold text-botanical-green/30">No Geographic Zones Defined.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Helper footer */}
        <div className="mt-12 flex items-center gap-4 p-8 bg-botanical-green/5 border border-botanical-green/10 rounded-sm">
          <Truck size={24} className="text-botanical-green/40" />
          <p className="text-xs text-botanical-green/60 leading-relaxed">
            Shipping rates configured here are automatically calculated at checkout based on the patient's selected delivery address. Ensure Fez Delivery coordinates are verified.
          </p>
        </div>

      </div>
    </main>
  );
}

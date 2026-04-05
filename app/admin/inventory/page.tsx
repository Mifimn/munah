"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Save, 
  UploadCloud, 
  Plus, 
  X, 
  Leaf, 
  FileText, 
  Beaker, 
  Activity 
} from "lucide-react";
import Link from "next/link";

export default function InventoryEditor() {
  // --- STATE MANAGEMENT ---
  const [categories, setCategories] = useState(["Immunity", "Sleep", "Digestion", "Infections"]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    ingredients: "",
    usage: "",
    image: null as string | null,
  });

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "ADD_NEW") {
      setIsAddingCategory(true);
      setFormData({ ...formData, category: "" });
    } else {
      setIsAddingCategory(false);
      setFormData({ ...formData, category: e.target.value });
    }
  };

  const saveNewCategory = () => {
    if (newCategory.trim() !== "") {
      setCategories([...categories, newCategory]);
      setFormData({ ...formData, category: newCategory });
      setIsAddingCategory(false);
      setNewCategory("");
    }
  };

  return (
    <main className="min-h-screen bg-earth-silk pb-20">
      
      {/* --- 1. TOP COMMAND BAR --- */}
      <div className="sticky top-0 z-50 bg-earth-silk/90 backdrop-blur-md border-b border-botanical-green/10">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/admin" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-botanical-green/50 hover:text-botanical-green transition-colors">
            <ArrowLeft size={16} /> Back to Command Center
          </Link>
          
          <button className="flex items-center gap-2 bg-botanical-green text-clinical-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:bg-botanical-green/90 transition-all">
            <Save size={14} /> Publish to Archive
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-12">
        <div className="mb-12">
          <h1 className="font-serif text-4xl text-botanical-green tracking-tighter">Botanical Registry</h1>
          <p className="text-sm text-botanical-green/50 mt-2">Log a new clinical formula into the apothecary.</p>
        </div>

        {/* --- 2. THE REGISTRY GRID --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* LEFT: Image & Core Identity */}
          <div className="lg:col-span-4 space-y-8">
            {/* Image Upload Area */}
            <div className="w-full aspect-[4/5] bg-botanical-green/5 border-2 border-dashed border-botanical-green/20 rounded-sm flex flex-col items-center justify-center text-botanical-green/40 hover:bg-botanical-green/10 hover:border-botanical-green/40 transition-all cursor-pointer group">
              <UploadCloud size={40} className="mb-4 group-hover:-translate-y-1 transition-transform" />
              <p className="text-[10px] uppercase tracking-widest font-bold">Upload Botanical Image</p>
              <p className="text-xs font-light mt-2">High-res JPG or PNG</p>
            </div>

            {/* Price & Stock */}
            <div className="bg-clinical-white p-6 border border-botanical-green/5 shadow-sm space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2"><Leaf size={12}/> Unit Price (₦)</label>
                <input 
                  type="number" 
                  name="price"
                  placeholder="0.00" 
                  className="w-full mt-2 border-b border-botanical-green/20 py-2 outline-none focus:border-botanical-green bg-transparent text-xl font-sans text-botanical-green" 
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Initial Stock Level</label>
                <input 
                  type="number" 
                  name="stock"
                  placeholder="e.g. 50" 
                  className="w-full mt-2 border-b border-botanical-green/20 py-2 outline-none focus:border-botanical-green bg-transparent text-sm font-sans text-botanical-green" 
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          {/* RIGHT: Clinical Data Entry */}
          <div className="lg:col-span-8 space-y-8">
            
            <div className="bg-clinical-white p-8 sm:p-10 border border-botanical-green/5 shadow-sm space-y-10">
              
              {/* Product Name */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Formula Name</label>
                <input 
                  type="text" 
                  name="name"
                  placeholder="e.g. Immunity Elixir" 
                  className="w-full mt-2 border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green bg-transparent text-3xl font-serif text-botanical-green placeholder:text-botanical-green/20" 
                  onChange={handleInputChange}
                />
              </div>

              {/* Dynamic Category Selector */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Classification (Category)</label>
                
                {!isAddingCategory ? (
                  <select 
                    name="category"
                    onChange={handleCategorySelect}
                    value={formData.category}
                    className="w-full mt-2 border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Select a category...</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                    <option value="ADD_NEW" className="font-bold text-botanical-green">✦ Create New Category...</option>
                  </select>
                ) : (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 mt-2">
                    <input 
                      type="text" 
                      placeholder="Enter new category name..." 
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 border-b border-botanical-green/50 py-3 outline-none focus:border-botanical-green bg-botanical-green/5 px-4 text-sm text-botanical-green" 
                      autoFocus
                    />
                    <button onClick={saveNewCategory} className="bg-botanical-green text-clinical-white p-3 hover:bg-botanical-green/90 transition-colors">
                      <Plus size={18} />
                    </button>
                    <button onClick={() => setIsAddingCategory(false)} className="bg-red-800/10 text-red-800 p-3 hover:bg-red-800/20 transition-colors">
                      <X size={18} />
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2 mb-3"><FileText size={14}/> Clinical Description</label>
                <textarea 
                  name="description"
                  rows={4} 
                  placeholder="Detail the medical benefits and ancestral origin..." 
                  className="w-full border border-botanical-green/20 p-5 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green leading-relaxed resize-none rounded-sm" 
                  onChange={handleInputChange}
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2 mb-3"><Beaker size={14}/> Clinical Ingredients</label>
                <textarea 
                  name="ingredients"
                  rows={3} 
                  placeholder="e.g. Echinacea Purpurea Root (organic), Elderberry Extract..." 
                  className="w-full border border-botanical-green/20 p-5 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green leading-relaxed resize-none rounded-sm" 
                  onChange={handleInputChange}
                />
              </div>

              {/* Dosage & Ritual */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2 mb-3"><Activity size={14}/> Dosage & Ritual</label>
                <textarea 
                  name="usage"
                  rows={3} 
                  placeholder="e.g. Take 2 full droppers (2ml) daily. Best taken under the tongue..." 
                  className="w-full border border-botanical-green/20 p-5 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green leading-relaxed resize-none rounded-sm" 
                  onChange={handleInputChange}
                />
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
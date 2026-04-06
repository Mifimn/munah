"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, Save, UploadCloud, Plus, X, Leaf, FileText, 
  Beaker, Activity, Droplets, Loader2, CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function InventoryEditor() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE ---
  const [categories, setCategories] = useState<string[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    volume: "",
    category: "",
    description: "",
    ingredients: "",
    usage: "",
    image_url: "" as string | null,
  });

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('name');
      if (data) setCategories(data.map(c => c.name));
    }
    fetchCategories();
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `product-images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('botanicals')
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('botanicals')
      .getPublicUrl(filePath);

    setFormData(prev => ({ ...prev, image_url: publicUrl }));
    setIsUploading(false);
  };

  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) return;
    const { error } = await supabase.from('categories').insert([{ name: newCategoryName }]);
    
    if (!error) {
      setCategories([...categories, newCategoryName]);
      setFormData({ ...formData, category: newCategoryName });
      setIsAddingCategory(false);
      setNewCategoryName("");
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    
    const { error } = await supabase.from('products').insert([
      {
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        volume: formData.volume,
        category_name: formData.category,
        description: formData.description,
        ingredients: formData.ingredients,
        usage: formData.usage,
        image_url: formData.image_url
      }
    ]);

    if (!error) {
      setShowSuccess(true);
    } else {
      console.error(error);
      alert("Error publishing: " + error.message);
    }
    setIsSaving(false);
  };

  return (
    <main className="min-h-screen bg-earth-silk pb-20">
      
      {/* --- SUCCESS MODAL --- */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-botanical-green/40 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
              className="bg-clinical-white p-12 max-w-md w-full text-center shadow-2xl border border-botanical-green/10"
            >
              <CheckCircle2 size={64} className="text-botanical-green mx-auto mb-6" />
              <h2 className="font-serif text-3xl text-botanical-green mb-4">Registry Updated</h2>
              <p className="text-sm text-botanical-green/60 mb-8 leading-relaxed">
                The botanical formula has been verified and archived in the clinical ledger.
              </p>
              <button 
                onClick={() => router.push('/admin')}
                className="w-full bg-botanical-green text-clinical-white py-4 rounded-full text-[10px] uppercase tracking-widest font-bold"
              >
                Return to Command Center
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-0 z-50 bg-earth-silk/90 backdrop-blur-md border-b border-botanical-green/10">
        <div className="max-w-[1200px] mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/admin" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-botanical-green/50 hover:text-botanical-green transition-colors">
            <ArrowLeft size={16} /> Back to Command Center
          </Link>
          
          <button 
            onClick={handlePublish}
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 bg-botanical-green text-clinical-white px-6 py-3 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} 
            Publish to Archive
          </button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 pt-12">
        <div className="mb-12">
          <h1 className="font-serif text-4xl text-botanical-green tracking-tighter">Botanical Registry</h1>
          <p className="text-sm text-botanical-green/50 mt-2">Log a new clinical formula or raw superfood into the apothecary.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-4 space-y-8">
            {/* Image Upload Area */}
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden accept="image/*" />
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-full aspect-[4/5] bg-botanical-green/5 border-2 border-dashed border-botanical-green/20 rounded-sm flex flex-col items-center justify-center text-botanical-green/40 hover:bg-botanical-green/10 transition-all cursor-pointer group relative overflow-hidden"
            >
              {formData.image_url ? (
                <img src={formData.image_url} className="absolute inset-0 w-full h-full object-cover" alt="Upload Preview" />
              ) : (
                <>
                  {isUploading ? <Loader2 className="animate-spin mb-4" /> : <UploadCloud size={40} className="mb-4" />}
                  <p className="text-[10px] uppercase tracking-widest font-bold">Upload Image</p>
                </>
              )}
            </div>

            <div className="bg-clinical-white p-6 border border-botanical-green/5 shadow-sm space-y-6">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2"><Leaf size={12}/> Base Price (₦)</label>
                <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="0.00" className="w-full mt-2 border-b border-botanical-green/20 py-2 outline-none focus:border-botanical-green bg-transparent text-xl font-sans text-botanical-green" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2"><Droplets size={12}/> Volume / Size</label>
                <input type="text" name="volume" value={formData.volume} onChange={handleInputChange} placeholder="e.g. 1 Litre" className="w-full mt-2 border-b border-botanical-green/20 py-2 outline-none focus:border-botanical-green bg-transparent text-sm font-sans text-botanical-green" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Initial Stock Level</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} placeholder="e.g. 50" className="w-full mt-2 border-b border-botanical-green/20 py-2 outline-none focus:border-botanical-green bg-transparent text-sm font-sans text-botanical-green" />
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-clinical-white p-8 sm:p-10 border border-botanical-green/5 shadow-sm space-y-10">
              
              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Original Wild Honey" className="w-full mt-2 border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green bg-transparent text-3xl font-serif text-botanical-green" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Classification (Category)</label>
                {!isAddingCategory ? (
                  <select name="category" onChange={(e) => e.target.value === "ADD_NEW" ? setIsAddingCategory(true) : handleInputChange(e)} value={formData.category} className="w-full mt-2 border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green appearance-none cursor-pointer">
                    <option value="" disabled>Select a category...</option>
                    {categories.map((cat, i) => <option key={i} value={cat}>{cat}</option>)}
                    <option value="ADD_NEW" className="font-bold">✦ Create New Category...</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-3 mt-2">
                    <input type="text" placeholder="New category name..." value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="flex-1 border-b border-botanical-green/50 py-3 outline-none bg-botanical-green/5 px-4 text-sm text-botanical-green" autoFocus />
                    <button onClick={handleSaveCategory} className="bg-botanical-green text-clinical-white p-3"><Plus size={18} /></button>
                    <button onClick={() => setIsAddingCategory(false)} className="bg-red-800/10 text-red-800 p-3"><X size={18} /></button>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2 mb-3"><FileText size={14}/> Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} placeholder="Purity, source, and benefits..." className="w-full border border-botanical-green/20 p-5 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green leading-relaxed resize-none rounded-sm" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2 mb-3"><Beaker size={14}/> Ingredients</label>
                <textarea name="ingredients" value={formData.ingredients} onChange={handleInputChange} rows={3} placeholder="Purity markers..." className="w-full border border-botanical-green/20 p-5 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green resize-none rounded-sm" />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2 mb-3"><Activity size={14}/> Usage Ritual</label>
                <textarea name="usage" value={formData.usage} onChange={handleInputChange} rows={3} placeholder="Dosage..." className="w-full border border-botanical-green/20 p-5 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green resize-none rounded-sm" />
              </div>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}

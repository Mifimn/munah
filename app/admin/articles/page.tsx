"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Boxes, ListOrdered, Settings, Plus, Search, 
  Edit3, Trash2, X, ShieldCheck, FileText, PenTool, Tag, Image as ImageIcon, 
  Eye, Type, AlignLeft, List, Link as LinkIcon 
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ArticleEditor() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const pathname = usePathname() || "/admin/articles";

  // --- MOCK DATA ---
  const [articles, setArticles] = useState([
    { id: "ART-01", title: "The Ancestral Guide to Fasting Safely", date: "April 02, 2026", views: 1240, status: "Published", tags: ["Sahur Gruel"] },
    { id: "ART-02", title: "Why Bitter Herbs Cure Cellular Fatigue", date: "March 28, 2026", views: 890, status: "Published", tags: ["Digestive Bitters", "Immunity Elixir"] },
    { id: "ART-03", title: "Understanding Herbal Extractions", date: "Draft", views: 0, status: "Draft", tags: [] },
  ]);

  // Mock inventory for tagging
  const availableProducts = ["Immunity Elixir", "Sahur Gruel", "Digestive Bitters", "Deep Sleep Botanicals", "Cellular Detox"];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const handleTagProduct = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const product = e.target.value;
    if (product && !selectedTags.includes(product)) {
      setSelectedTags([...selectedTags, product]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  return (
    <main className="min-h-screen bg-earth-silk flex flex-col lg:flex-row">
      
      {/* --- 1. DESKTOP SIDEBAR --- */}
      <aside className="w-[280px] bg-botanical-green fixed h-full z-20 hidden lg:flex flex-col">
        <div className="p-8 border-b border-clinical-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-clinical-white/50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-clinical-white/50 font-bold">Secure Portal</span>
          </div>
          <h1 className="font-serif text-2xl text-clinical-white">Command Center</h1>
          <p className="text-xs text-clinical-white/40 font-light mt-1">Admin: Modina Olagunju</p>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          <Link href="/admin" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname === "/admin" ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}><LayoutDashboard size={16} /> Overview</Link>
          <Link href="/admin/inventory" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname.includes("/admin/inventory") ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}><Boxes size={16} /> Inventory</Link>
          <Link href="/admin/orders" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname.includes("/admin/orders") ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}><ListOrdered size={16} /> Order Ledger</Link>
          <Link href="/admin/articles" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname.includes("/admin/articles") ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}><FileText size={16} /> Articles</Link>
        </nav>
      </aside>

      {/* --- 2. MOBILE NAVIGATION --- */}
      <div className="lg:hidden bg-botanical-green w-full sticky top-0 z-20 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b border-clinical-white/10">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-clinical-white/50" />
            <h1 className="font-serif text-lg text-clinical-white">Admin Portal</h1>
          </div>
        </div>
        <nav className="flex overflow-x-auto no-scrollbar px-4 py-3 gap-2">
          <Link href="/admin" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname === "/admin" ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Overview</Link>
          <Link href="/admin/inventory" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname.includes("/admin/inventory") ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Inventory</Link>
          <Link href="/admin/orders" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname.includes("/admin/orders") ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Orders</Link>
          <Link href="/admin/articles" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname.includes("/admin/articles") ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Articles</Link>
        </nav>
      </div>

      {/* --- 3. THE WIDE EDITOR DRAWER (Content Editor) --- */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDrawerOpen(false)} className="fixed inset-0 bg-botanical-green/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-[700px] bg-clinical-white z-[110] shadow-2xl flex flex-col">
              
              <div className="p-6 md:p-8 border-b border-botanical-green/10 flex justify-between items-center bg-earth-silk/50">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-botanical-green/40 font-bold">Content Studio</p>
                  <h2 className="font-serif text-xl md:text-2xl text-botanical-green">Draft New Article</h2>
                </div>
                <button onClick={() => setIsDrawerOpen(false)} className="p-3 bg-botanical-green/5 rounded-full text-botanical-green hover:bg-botanical-green hover:text-white transition-all"><X size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                
                {/* Title */}
                <div>
                  <input type="text" placeholder="Article Headline..." className="w-full border-b border-botanical-green/20 py-4 outline-none focus:border-botanical-green bg-transparent text-3xl font-serif text-botanical-green placeholder:text-botanical-green/30" />
                </div>

                {/* Cover Image */}
                <div className="w-full aspect-[21/9] bg-botanical-green/5 border border-dashed border-botanical-green/20 flex flex-col items-center justify-center text-botanical-green/40 hover:bg-botanical-green/10 transition-colors cursor-pointer rounded-sm">
                  <ImageIcon size={32} className="mb-2" />
                  <span className="text-[10px] uppercase tracking-widest font-bold">Upload Cover Art</span>
                </div>

                {/* Product Tagger (FIXED REACT WARNING HERE) */}
                <div className="p-6 bg-earth-silk/50 border border-botanical-green/10 rounded-sm">
                  <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold flex items-center gap-2 mb-4"><Tag size={14}/> Tag Botanical Products</label>
                  <select 
                    onChange={handleTagProduct} 
                    value="" 
                    className="w-full border-b border-botanical-green/20 py-2 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green appearance-none cursor-pointer mb-4"
                  >
                    <option value="" disabled>Select an extract to feature...</option>
                    {availableProducts.map(prod => <option key={prod} value={prod}>{prod}</option>)}
                  </select>
                  
                  {/* Tag Pills */}
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <span key={tag} className="flex items-center gap-2 bg-botanical-green text-clinical-white px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
                        {tag} <button onClick={() => removeTag(tag)}><X size={12} className="hover:text-red-400" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Rich Text Editor Toolbar (Visual Only) */}
                <div className="border border-botanical-green/20 rounded-sm overflow-hidden">
                  <div className="flex items-center gap-2 bg-botanical-green/5 p-2 border-b border-botanical-green/20">
                    <button className="p-2 text-botanical-green/60 hover:text-botanical-green hover:bg-botanical-green/10 rounded"><Type size={16} /></button>
                    <button className="p-2 text-botanical-green/60 hover:text-botanical-green hover:bg-botanical-green/10 rounded"><AlignLeft size={16} /></button>
                    <button className="p-2 text-botanical-green/60 hover:text-botanical-green hover:bg-botanical-green/10 rounded"><List size={16} /></button>
                    <div className="w-[1px] h-4 bg-botanical-green/20 mx-2" />
                    <button className="p-2 text-botanical-green/60 hover:text-botanical-green hover:bg-botanical-green/10 rounded"><LinkIcon size={16} /></button>
                    <button className="p-2 text-botanical-green/60 hover:text-botanical-green hover:bg-botanical-green/10 rounded"><ImageIcon size={16} /></button>
                  </div>
                  <textarea 
                    rows={15} 
                    placeholder="Write your clinical wisdom here..." 
                    className="w-full p-6 outline-none bg-transparent text-sm text-botanical-green leading-relaxed resize-none"
                  />
                </div>

              </div>

              <div className="p-6 md:p-8 bg-earth-silk border-t border-botanical-green/10 flex gap-4">
                <button className="w-1/3 bg-botanical-green/10 text-botanical-green py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-botanical-green/20 transition-all">Save Draft</button>
                <button className="w-2/3 bg-botanical-green text-clinical-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-botanical-green/90 transition-all">Publish Article</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- 4. MAIN CANVAS --- */}
      <div className="flex-1 lg:ml-[280px] p-4 sm:p-6 md:p-12 w-full overflow-hidden">
        
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-12 border-b border-botanical-green/10 pb-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl text-botanical-green tracking-tighter">Article Library</h2>
            <p className="text-xs md:text-sm text-botanical-green/50 mt-2">Publish ancestral wisdom and health protocols.</p>
          </div>
          <button onClick={() => setIsDrawerOpen(true)} className="flex items-center gap-2 bg-botanical-green text-clinical-white px-6 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:bg-botanical-green/90 transition-all w-full sm:w-auto justify-center">
            <PenTool size={14} /> Write Article
          </button>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-clinical-white p-5 md:p-6 border border-botanical-green/5 shadow-sm rounded-sm"><div className="flex justify-between items-start mb-4"><p className="text-[10px] uppercase tracking-widest text-botanical-green/50 font-bold">Published</p><FileText size={16} className="text-botanical-green/30" /></div><h3 className="font-serif text-2xl md:text-3xl text-botanical-green">12</h3></div>
          <div className="bg-clinical-white p-5 md:p-6 border border-botanical-green/5 shadow-sm rounded-sm"><div className="flex justify-between items-start mb-4"><p className="text-[10px] uppercase tracking-widest text-botanical-green/50 font-bold">Total Reads</p><Eye size={16} className="text-botanical-green/40" /></div><h3 className="font-serif text-2xl md:text-3xl text-botanical-green">14,209</h3></div>
          <div className="bg-botanical-green p-5 md:p-6 border border-botanical-green/5 shadow-xl rounded-sm text-clinical-white"><div className="flex justify-between items-start mb-4"><p className="text-[10px] uppercase tracking-widest text-clinical-white/60 font-bold">Tag Conversions</p><Tag size={16} className="text-clinical-white/40" /></div><h3 className="font-serif text-2xl md:text-3xl">4.2%</h3></div>
        </div>

        {/* --- ARTICLE TABLE --- */}
        <div className="bg-clinical-white border border-botanical-green/5 shadow-sm rounded-sm overflow-hidden w-full">
          <div className="p-4 md:p-6 border-b border-botanical-green/5 bg-earth-silk/30">
            <div className="flex items-center gap-3 w-full sm:max-w-sm bg-clinical-white px-4 py-2 border border-botanical-green/10 rounded-full">
              <Search size={14} className="text-botanical-green/40" />
              <input type="text" placeholder="Search articles..." className="w-full bg-transparent outline-none text-xs text-botanical-green" />
            </div>
          </div>
          
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-botanical-green/10 text-[10px] uppercase tracking-widest text-botanical-green/40">
                  <th className="p-4 md:p-6 font-bold whitespace-nowrap">Article Title</th>
                  <th className="p-4 md:p-6 font-bold whitespace-nowrap">Date</th>
                  <th className="p-4 md:p-6 font-bold whitespace-nowrap">Tagged Products</th>
                  <th className="p-4 md:p-6 font-bold whitespace-nowrap">Status</th>
                  <th className="p-4 md:p-6 font-bold text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article, index) => (
                  <tr key={index} className="border-b border-botanical-green/5 hover:bg-earth-silk/20 transition-colors group">
                    <td className="p-4 md:p-6 font-serif text-base md:text-lg text-botanical-green whitespace-nowrap max-w-[250px] truncate">{article.title}</td>
                    <td className="p-4 md:p-6 text-xs font-mono text-botanical-green/60 whitespace-nowrap">{article.date}</td>
                    <td className="p-4 md:p-6 whitespace-nowrap">
                      <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {article.tags.length > 0 ? article.tags.map(tag => (
                          <span key={tag} className="text-[9px] bg-botanical-green/10 text-botanical-green px-2 py-1 rounded-sm uppercase tracking-widest">{tag}</span>
                        )) : <span className="text-[10px] text-botanical-green/30 italic">No tags</span>}
                      </div>
                    </td>
                    <td className="p-4 md:p-6 whitespace-nowrap">
                      <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full ${article.status === 'Published' ? 'bg-botanical-green text-white' : 'bg-botanical-green/10 text-botanical-green/60'}`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="p-4 md:p-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button className="p-2 bg-botanical-green/5 hover:bg-botanical-green/10 rounded-full text-botanical-green transition-colors"><Edit3 size={14} /></button>
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

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Boxes, ListOrdered, Settings, Plus, Search, 
  Edit3, Trash2, X, ShieldCheck, TrendingUp, AlertCircle, Menu, FileText, Truck, LogOut, User, Activity, Loader2, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminCommandCenter() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inventory, setInventory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // --- DELETE MODAL STATE ---
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const pathname = usePathname() || "";
  const router = useRouter();

  // --- ADMIN PROFILE STATE ---
  const [adminEmail, setAdminEmail] = useState("Loading...");
  const [adminInitial, setAdminInitial] = useState("M");

  // --- REAL-TIME DATABASE FETCH & SECURITY LOCK ---
  useEffect(() => {
    async function checkAuthAndFetchData() {
      // 1. Security Lock: Verify User
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/admin/login");
        return;
      }

      // 2. Security Lock: Verify Admin Status
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();

      if (!profile?.is_admin) {
        router.push("/admin/login");
        return;
      }

      // 3. User is verified Admin. Load their data!
      setAdminEmail(user.email || "");
      setAdminInitial(user.email ? user.email.charAt(0).toUpperCase() : "A");
      
      await fetchInventory();
    }

    checkAuthAndFetchData();
  }, []);

  async function fetchInventory() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setInventory(data);
    }
    setIsLoading(false);
  }

  // --- LOGOUT HANDLER ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login"); 
  };

  // --- DELETE CONFIRMATION HANDLER (Upgraded to delete images too!) ---
  const confirmDelete = async () => {
    if (!productToDelete) return;

    // 1. Find the product in our list to get its image URL
    const product = inventory.find(p => p.id === productToDelete);

    if (product && product.image_url) {
      // 2. Extract the exact file path from the public URL
      const urlParts = product.image_url.split('/public/botanicals/');
      
      if (urlParts.length === 2) {
        const filePath = urlParts[1]; 

        // 3. Tell the Storage Bucket to delete the file
        const { error: storageError } = await supabase.storage
          .from('botanicals')
          .remove([filePath]);

        if (storageError) {
          console.error("Failed to delete image from bucket:", storageError);
        } else {
          console.log("Image successfully scrubbed from bucket.");
        }
      }
    }

    // 4. Finally, delete the product row from the database
    const { error: dbError } = await supabase
      .from('products')
      .delete()
      .eq('id', productToDelete);

    if (!dbError) {
      setProductToDelete(null);
      fetchInventory(); // Refresh the list
    } else {
      console.error("Failed to delete product from database:", dbError);
    }
  };

  // --- QUICK STATS CALCULATIONS ---
  const activeFormulas = inventory.length;
  const depletedStock = inventory.filter(item => item.stock === 0).length;
  const grossValue = inventory.reduce((acc, item) => acc + (item.price * item.stock), 0);

  // --- SEARCH FILTER ---
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-earth-silk flex flex-col lg:flex-row relative">

      {/* --- DELETE CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setProductToDelete(null)} 
              className="absolute inset-0 bg-botanical-green/60 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              exit={{ opacity: 0, scale: 0.95 }} 
              className="relative w-full max-w-md bg-clinical-white shadow-2xl p-8 border border-red-800/10 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={28} className="text-red-800" />
              </div>
              <h3 className="font-serif text-2xl text-botanical-green mb-2">Delete Formula?</h3>
              <p className="text-sm text-botanical-green/60 mb-8">This action will permanently erase this product and its image from the clinical registry. This cannot be undone.</p>
              <div className="flex gap-4">
                <button onClick={() => setProductToDelete(null)} className="flex-1 bg-botanical-green/5 text-botanical-green py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-botanical-green/10 transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 bg-red-800 text-clinical-white py-3 text-[10px] uppercase tracking-widest font-bold hover:bg-red-900 transition-colors shadow-lg">Erase Record</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- 1. DESKTOP SIDEBAR --- */}
      <aside className="w-[280px] bg-botanical-green fixed h-full z-20 hidden lg:flex flex-col">
        <div className="p-8 border-b border-clinical-white/10">
          <div className="flex items-center gap-2 mb-2">
            <ShieldCheck size={16} className="text-clinical-white/50" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-clinical-white/50 font-bold">Secure Portal</span>
          </div>
          <h1 className="font-serif text-2xl text-clinical-white">Command Center</h1>
          <p className="text-xs text-clinical-white/40 font-light mt-1">Admin: {adminEmail.split('@')[0]}</p>
        </div>

        <nav className="flex-1 py-8 px-4 space-y-2">
          <Link href="/admin" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname === "/admin" ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}>
            <LayoutDashboard size={16} /> Overview
          </Link>
          <Link href="/admin/inventory" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname.includes("/admin/inventory") ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}>
            <Boxes size={16} /> Inventory
          </Link>
          <Link href="/admin/orders" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname.includes("/admin/orders") ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}>
            <ListOrdered size={16} /> Order Ledger
          </Link>
          <Link href="/admin/articles" className={`w-full flex items-center gap-4 px-6 py-4 rounded-sm transition-all text-xs uppercase tracking-widest font-bold ${pathname.includes("/admin/articles") ? "bg-clinical-white text-botanical-green" : "text-clinical-white/50 hover:bg-clinical-white/5 hover:text-clinical-white"}`}>
            <FileText size={16} /> Articles
          </Link>
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
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-clinical-white/50" />
            <h1 className="font-serif text-lg text-clinical-white">Admin Portal</h1>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-clinical-white"><Settings size={18} /></button>
        </div>
        <nav className="flex overflow-x-auto no-scrollbar px-4 py-3 gap-2">
          <Link href="/admin" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname === "/admin" ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Overview</Link>
          <Link href="/admin/inventory" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname.includes("/admin/inventory") ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Inventory</Link>
          <Link href="/admin/orders" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname.includes("/admin/orders") ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Orders</Link>
          <Link href="/admin/articles" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname.includes("/admin/articles") ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Articles</Link>
          <Link href="/admin/logistics" className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${pathname.includes("/admin/logistics") ? "bg-clinical-white text-botanical-green" : "bg-clinical-white/10 text-clinical-white"}`}>Logistics</Link>
        </nav>
      </div>

      {/* --- 3. SETTINGS & STATUS DRAWER --- */}
      <AnimatePresence>
        {isSettingsOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSettingsOpen(false)} className="fixed inset-0 bg-botanical-green/40 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-clinical-white z-[110] shadow-2xl flex flex-col">
              <div className="p-8 border-b border-botanical-green/10 flex justify-between items-center">
                <h2 className="font-serif text-2xl text-botanical-green">System Status</h2>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 bg-botanical-green/5 rounded-full text-botanical-green"><X size={20} /></button>
              </div>
              <div className="flex-1 p-8 space-y-8">
                <div className="flex items-center gap-4 p-4 bg-earth-silk border border-botanical-green/10">
                  <div className="w-12 h-12 bg-botanical-green rounded-full flex items-center justify-center text-clinical-white font-bold text-xl">{adminInitial}</div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest font-bold text-botanical-green/40">Registered Admin</p>
                    <p className="text-sm font-bold text-botanical-green">{adminEmail}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-botanical-green/5">
                    <span className="flex items-center gap-2 text-xs text-botanical-green/60"><Activity size={14}/> Database Connection</span>
                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Active</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-botanical-green/5">
                    <span className="flex items-center gap-2 text-xs text-botanical-green/60"><ShieldCheck size={14}/> Security Level</span>
                    <span className="text-[10px] font-bold text-botanical-green uppercase tracking-widest">High (SSL)</span>
                  </div>
                </div>
              </div>
              <div className="p-8 border-t border-botanical-green/10">
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 bg-red-800 text-clinical-white py-4 rounded-sm text-xs font-bold uppercase tracking-widest shadow-lg">
                  <LogOut size={16} /> Terminate Session
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
            <h2 className="font-serif text-3xl md:text-4xl text-botanical-green tracking-tighter">Inventory Manager</h2>
            <p className="text-xs md:text-sm text-botanical-green/50 mt-2">Oversee stock levels and registry.</p>
          </div>
          <Link href="/admin/inventory" className="flex items-center gap-2 bg-botanical-green text-clinical-white px-6 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold shadow-lg hover:bg-botanical-green/90 transition-all w-full sm:w-auto justify-center">
            <Plus size={14} /> Add Product
          </Link>
        </header>

        {/* Real-time Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-clinical-white p-5 md:p-6 border border-botanical-green/5 shadow-sm rounded-sm">
            <div className="flex justify-between items-start mb-4"><p className="text-[10px] uppercase tracking-widest text-botanical-green/50 font-bold">Active Formulas</p><Boxes size={16} className="text-botanical-green/30" /></div>
            <h3 className="font-serif text-2xl md:text-3xl text-botanical-green">{activeFormulas}</h3>
          </div>
          <div className="bg-clinical-white p-5 md:p-6 border border-botanical-green/5 shadow-sm rounded-sm">
            <div className="flex justify-between items-start mb-4"><p className="text-[10px] uppercase tracking-widest text-botanical-green/50 font-bold">Depleted Stock</p><AlertCircle size={16} className="text-red-800/40" /></div>
            <h3 className="font-serif text-2xl md:text-3xl text-botanical-green">{depletedStock}</h3>
          </div>
          <div className="bg-botanical-green p-5 md:p-6 border border-botanical-green/5 shadow-xl rounded-sm text-clinical-white">
            <div className="flex justify-between items-start mb-4"><p className="text-[10px] uppercase tracking-widest text-clinical-white/60 font-bold">Gross Value</p><TrendingUp size={16} className="text-clinical-white/40" /></div>
            <h3 className="font-serif text-2xl md:text-3xl">₦{grossValue.toLocaleString()}</h3>
          </div>
        </div>

        {/* --- INVENTORY TABLE --- */}
        <div className="bg-clinical-white border border-botanical-green/5 shadow-sm rounded-sm overflow-hidden w-full">
          <div className="p-4 md:p-6 border-b border-botanical-green/5 bg-earth-silk/30">
            <div className="flex items-center gap-3 w-full sm:max-w-sm bg-clinical-white px-4 py-2 border border-botanical-green/10 rounded-full">
              <Search size={14} className="text-botanical-green/40" />
              <input 
                type="text" 
                placeholder="Search registry..." 
                className="w-full bg-transparent outline-none text-xs text-botanical-green" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              {isLoading ? (
                <tbody>
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <Loader2 className="animate-spin mx-auto text-botanical-green/20" size={40} />
                    </td>
                  </tr>
                </tbody>
              ) : (
                <>
                  <thead>
                    <tr className="border-b border-botanical-green/10 text-[10px] uppercase tracking-widest text-botanical-green/40">
                      <th className="p-4 md:p-6 font-bold whitespace-nowrap">SKU</th>
                      <th className="p-4 md:p-6 font-bold whitespace-nowrap">Botanical Name</th>
                      <th className="p-4 md:p-6 font-bold whitespace-nowrap">Category</th>
                      <th className="p-4 md:p-6 font-bold whitespace-nowrap">Price (Base)</th>
                      <th className="p-4 md:p-6 font-bold whitespace-nowrap">Total Stock</th>
                      <th className="p-4 md:p-6 font-bold text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => (
                      <tr key={item.id} className="border-b border-botanical-green/5 hover:bg-earth-silk/20 transition-colors group">
                        <td className="p-4 md:p-6 text-xs font-mono text-botanical-green/60 whitespace-nowrap uppercase">{item.id.slice(0, 8)}</td>
                        <td className="p-4 md:p-6 font-serif text-base md:text-lg text-botanical-green whitespace-nowrap">
                          {item.name}
                          {item.variants?.length > 1 && (
                            <span className="ml-2 text-[9px] bg-botanical-green/10 px-2 py-1 rounded-full uppercase tracking-widest text-botanical-green">
                              {item.variants.length} Sizes
                            </span>
                          )}
                        </td>
                        <td className="p-4 md:p-6 text-xs text-botanical-green/60 whitespace-nowrap">{item.category_name}</td>
                        <td className="p-4 md:p-6 font-sans text-sm text-botanical-green whitespace-nowrap">
                          ₦{(item.variants?.[0]?.price || item.price || 0).toLocaleString()}
                        </td>
                        <td className="p-4 md:p-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${item.stock > 10 ? 'bg-botanical-green' : item.stock > 0 ? 'bg-yellow-500' : 'bg-red-800'}`} />
                            <span className="text-xs text-botanical-green/70">{item.stock} Units</span>
                          </div>
                        </td>
                        <td className="p-4 md:p-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-3 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                            <Link href={`/admin/inventory?id=${item.id}`} className="p-2 bg-botanical-green/5 hover:bg-botanical-green/10 rounded-full text-botanical-green transition-colors"><Edit3 size={14} /></Link>
                            <button onClick={() => setProductToDelete(item.id)} className="p-2 bg-red-800/5 hover:bg-red-800/10 rounded-full text-red-800 transition-colors"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
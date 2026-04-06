"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, Boxes, ListOrdered, Settings, Search, 
  X, ShieldCheck, FileText, Eye, MapPin, Truck, Printer, CheckCircle2, ChevronRight, Package, Loader2
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isReceiptMode, setIsReceiptMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const pathname = usePathname() || "/admin/orders";

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setOrders(data);
    }
    setIsLoading(false);
  }

  const updateStatus = async (orderId: string, newStatus: string) => {
    setIsUpdating(true);
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId);

    if (!error) {
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }
    setIsUpdating(false);
  };

  const openOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setIsReceiptMode(false);
  };

  // --- STATS CALCULATION ---
  const pendingDispatch = orders.filter(o => o.status === 'Ready for Dispatch').length;
  const inFormulation = orders.filter(o => o.status === 'In Formulation').length;
  const dailyRevenue = orders
    .filter(o => new Date(o.created_at).toDateString() === new Date().toDateString())
    .reduce((acc, o) => acc + o.total_amount, 0);

  // --- SEARCH FILTER ---
  const filteredOrders = orders.filter(o => 
    o.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        </nav>
      </div>

      {/* --- 3. ORDER DETAIL & RECEIPT DRAWER --- */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-botanical-green/60 backdrop-blur-sm z-[100]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed right-0 top-0 h-full w-full max-w-[600px] bg-clinical-white z-[110] shadow-2xl flex flex-col">
              
              <div className="p-6 md:p-8 border-b border-botanical-green/10 flex justify-between items-center bg-earth-silk/50">
                <div className="flex gap-4">
                  <button onClick={() => setIsReceiptMode(false)} className={`text-[10px] uppercase tracking-[0.2em] font-bold pb-1 ${!isReceiptMode ? 'border-b-2 border-botanical-green text-botanical-green' : 'text-botanical-green/40'}`}>Logistics View</button>
                  <button onClick={() => setIsReceiptMode(true)} className={`text-[10px] uppercase tracking-[0.2em] font-bold pb-1 ${isReceiptMode ? 'border-b-2 border-botanical-green text-botanical-green' : 'text-botanical-green/40'}`}>Receipt View</button>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 bg-botanical-green/5 rounded-full text-botanical-green hover:bg-botanical-green hover:text-white transition-all"><X size={18} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                
                {!isReceiptMode ? (
                  <div className="space-y-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] text-botanical-green/40 font-bold">{selectedOrder.order_number}</p>
                      <h2 className="font-serif text-3xl text-botanical-green mt-1">{selectedOrder.customer_name}</h2>
                      <p className="text-sm text-botanical-green/60 font-mono mt-1">{selectedOrder.customer_phone} | {selectedOrder.customer_email}</p>
                    </div>

                    <div className="p-6 bg-earth-silk/50 border border-botanical-green/10 rounded-sm">
                      <div className="flex items-center gap-2 mb-2 text-botanical-green font-bold text-xs uppercase tracking-widest"><MapPin size={14}/> Dispatch Location</div>
                      <p className="text-sm text-botanical-green/80 font-serif leading-relaxed">
                        {selectedOrder.shipping_address}<br/>
                        <span className="font-sans font-bold">{selectedOrder.city}, {selectedOrder.state}, {selectedOrder.country}</span>
                      </p>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Status Update</label>
                      <div className="relative mt-2">
                        <select 
                          value={selectedOrder.status}
                          onChange={(e) => updateStatus(selectedOrder.id, e.target.value)}
                          disabled={isUpdating}
                          className="w-full border border-botanical-green/20 py-4 px-4 outline-none focus:border-botanical-green bg-botanical-green/5 text-sm font-bold text-botanical-green appearance-none rounded-sm cursor-pointer"
                        >
                          <option value="Order Received">Order Received</option>
                          <option value="In Formulation">In Formulation</option>
                          <option value="Ready for Dispatch">Ready for Dispatch</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                        {isUpdating && <Loader2 className="absolute right-4 top-4 animate-spin text-botanical-green" size={20} />}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold border-b border-botanical-green/10 pb-2 mb-4">Order Extracts</h3>
                      {selectedOrder.order_items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center mb-4 text-botanical-green">
                          <div className="flex items-center gap-3">
                            <span className="bg-botanical-green/10 px-2 py-1 rounded-sm text-xs font-mono">{item.quantity}x</span>
                            <span className="font-serif text-lg">{item.product_name}</span>
                          </div>
                          <span className="font-sans">₦{item.unit_price.toLocaleString()}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center border-t border-botanical-green/10 pt-4 font-bold text-botanical-green">
                        <span>Total Settlement</span>
                        <span className="text-xl">₦{selectedOrder.total_amount.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ) : (
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
                    <div className="flex justify-end text-lg font-bold border-t border-gray-200 pt-4">
                      <span>Total: ₦{selectedOrder.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 bg-earth-silk border-t border-botanical-green/10 flex gap-4">
                <button className="w-full bg-botanical-green text-clinical-white py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-botanical-green/90 transition-all flex items-center justify-center gap-2">
                  <Truck size={14} /> Update Dispatch Status
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
            <h2 className="font-serif text-3xl md:text-4xl text-botanical-green tracking-tighter">Order Logistics</h2>
            <p className="text-xs md:text-sm text-botanical-green/50 mt-2">Manage formulations, dispatch, and receipts.</p>
          </div>
        </header>

        {/* Real Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="bg-clinical-white p-5 md:p-6 border border-botanical-green/5 shadow-sm rounded-sm"><div className="flex justify-between items-start mb-4"><p className="text-[10px] uppercase tracking-widest text-botanical-green/50 font-bold">Pending Dispatch</p><Package size={16} className="text-botanical-green/30" /></div><h3 className="font-serif text-2xl md:text-3xl text-botanical-green">{pendingDispatch}</h3></div>
          <div className="bg-clinical-white p-5 md:p-6 border border-botanical-green/5 shadow-sm rounded-sm"><div className="flex justify-between items-start mb-4"><p className="text-[10px] uppercase tracking-widest text-botanical-green/50 font-bold">In Formulation</p><CheckCircle2 size={16} className="text-botanical-green/40" /></div><h3 className="font-serif text-2xl md:text-3xl text-botanical-green">{inFormulation}</h3></div>
          <div className="bg-botanical-green p-5 md:p-6 border border-botanical-green/5 shadow-xl rounded-sm text-clinical-white"><div className="flex justify-between items-start mb-4"><p className="text-[10px] uppercase tracking-widest text-clinical-white/60 font-bold">Revenue Today</p><FileText size={16} className="text-clinical-white/40" /></div><h3 className="font-serif text-2xl md:text-3xl">₦{dailyRevenue.toLocaleString()}</h3></div>
        </div>

        {/* --- ORDERS TABLE --- */}
        <div className="bg-clinical-white border border-botanical-green/5 shadow-sm rounded-sm overflow-hidden w-full">
          <div className="p-4 md:p-6 border-b border-botanical-green/5 bg-earth-silk/30 flex items-center gap-3">
             <Search size={14} className="text-botanical-green/40" />
             <input type="text" placeholder="Search Patient or Order ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent outline-none text-xs text-botanical-green" />
          </div>
          
          <div className="w-full overflow-x-auto">
            {isLoading ? (
               <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-botanical-green/20" size={40} /></div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-botanical-green/10 text-[10px] uppercase tracking-widest text-botanical-green/40">
                    <th className="p-4 md:p-6 font-bold">Order ID</th>
                    <th className="p-4 md:p-6 font-bold">Patient / Location</th>
                    <th className="p-4 md:p-6 font-bold">Date</th>
                    <th className="p-4 md:p-6 font-bold">Settlement</th>
                    <th className="p-4 md:p-6 font-bold">Logistics Status</th>
                    <th className="p-4 md:p-6 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-botanical-green/5 hover:bg-earth-silk/20 transition-colors group cursor-pointer" onClick={() => openOrderDetails(order)}>
                      <td className="p-4 md:p-6 font-bold text-xs tracking-widest text-botanical-green">{order.order_number}</td>
                      <td className="p-4 md:p-6">
                        <p className="font-serif text-base text-botanical-green">{order.customer_name}</p>
                        <p className="text-[10px] text-botanical-green/50 mt-1 truncate max-w-[200px]">{order.city}, {order.state}</p>
                      </td>
                      <td className="p-4 md:p-6 text-xs text-botanical-green/60">{new Date(order.created_at).toLocaleDateString()}</td>
                      <td className="p-4 md:p-6 font-sans text-sm text-botanical-green font-bold">₦{order.total_amount.toLocaleString()}</td>
                      <td className="p-4 md:p-6">
                        <span className={`text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full ${
                          order.status === 'Delivered' ? 'bg-botanical-green/10 text-botanical-green' : 
                          order.status === 'Ready for Dispatch' ? 'bg-yellow-500/10 text-yellow-700' : 
                          'bg-botanical-green text-white'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-4 md:p-6 text-right">
                        <button className="flex items-center justify-end gap-1 text-[10px] uppercase font-bold tracking-widest text-botanical-green/40 group-hover:text-botanical-green transition-colors ml-auto">
                          View <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, ChevronRight } from "lucide-react";

export default function CheckoutPage() {
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="space-y-6">
              <input type="text" placeholder="First Name" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              <input type="text" placeholder="Last Name" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              <input type="text" placeholder="Delivery Address" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
            </div>
            <div className="space-y-6">
              <input type="text" placeholder="City" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              <input type="text" placeholder="State/Province" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
              <input type="text" placeholder="Postal Code" className="w-full bg-transparent border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green" />
            </div>
          </div>

          <div className="p-8 bg-botanical-green/5 border border-botanical-green/10 rounded-sm">
            <div className="flex items-center gap-3 text-botanical-green mb-6">
              <ShieldCheck size={20} />
              <h3 className="font-serif text-xl">Encrypted Settlement</h3>
            </div>
            <p className="text-xs text-botanical-green/50 mb-8 leading-relaxed">
              Your transaction is secured by clinical-grade encryption protocol.
            </p>
            <button className="w-full bg-botanical-green text-clinical-white py-5 rounded-full text-xs font-bold uppercase tracking-widest">
              Finalize Order — $45.00
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
                <p className="text-sm text-botanical-green">$45.00</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-xs text-botanical-green/60">
                <span>Subtotal</span>
                <span>$45.00</span>
              </div>
              <div className="flex justify-between text-xs text-botanical-green/60">
                <span>Clinical Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between text-lg font-serif text-botanical-green pt-4 border-t border-botanical-green/10">
                <span>Total Settlement</span>
                <span>$45.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

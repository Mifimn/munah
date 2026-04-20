"use client";

import { useState } from "react";
import { usePaystackPayment } from "react-paystack";
import { CreditCard, Loader2, CheckCircle2 } from "lucide-react";

export default function TestPaymentPage() {
  const [amount, setAmount] = useState<number>(100);
  const [email, setEmail] = useState<string>("test@naturalcure.com");
  const [isProcessing, setIsProcessing] = useState(false);
  const [successRef, setSuccessRef] = useState("");

  // --- PAYSTACK CONFIGURATION ---
  const config = {
    reference: `TEST-${new Date().getTime().toString()}`,
    email: email,
    amount: amount * 100, // Paystack expects amount in Kobo (multiply by 100)
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string,
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    console.log("✅ TEST PAYMENT SUCCESSFUL:", reference);
    setSuccessRef(reference.reference);
    setIsProcessing(false);
  };

  const onClose = () => {
    console.log("❌ PAYMENT MODAL CLOSED");
    setIsProcessing(false);
  };

  const handleTestPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setSuccessRef("");
    
    // Trigger Paystack Popup
    initializePayment({ onSuccess, onClose });
  };

  return (
    <main className="min-h-screen bg-earth-silk flex items-center justify-center p-6">
      <div className="bg-clinical-white p-8 max-w-md w-full border border-botanical-green/20 shadow-2xl rounded-sm">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-botanical-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard size={24} className="text-botanical-green" />
          </div>
          <h1 className="font-serif text-3xl text-botanical-green">Payment Sandbox</h1>
          <p className="text-xs text-botanical-green/50 mt-2 uppercase tracking-widest font-bold">
            Live Gateway Test
          </p>
        </div>

        {successRef ? (
          <div className="bg-botanical-green/10 border border-botanical-green/20 p-6 text-center rounded-sm mb-6">
            <CheckCircle2 size={32} className="text-botanical-green mx-auto mb-3" />
            <h3 className="text-botanical-green font-bold mb-1">Payment Successful!</h3>
            <p className="text-xs text-botanical-green/70 break-all font-mono">Ref: {successRef}</p>
            <button 
              onClick={() => setSuccessRef("")} 
              className="mt-4 text-[10px] uppercase font-bold tracking-widest text-botanical-green underline"
            >
              Run Another Test
            </button>
          </div>
        ) : (
          <form onSubmit={handleTestPayment} className="space-y-6">
            
            <div>
              <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Test Amount (₦)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                min="100"
                className="w-full mt-2 border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green bg-transparent text-xl font-sans text-botanical-green" 
              />
              <p className="text-[9px] text-botanical-green/40 mt-1">Minimum ₦100 required by Paystack</p>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-botanical-green/60 font-bold">Customer Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 border-b border-botanical-green/20 py-3 outline-none focus:border-botanical-green bg-transparent text-sm text-botanical-green" 
              />
            </div>

            <button 
              type="submit"
              disabled={isProcessing || amount < 100}
              className="w-full bg-botanical-green text-clinical-white py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-botanical-green/90 transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isProcessing ? <Loader2 size={16} className="animate-spin" /> : null}
              {isProcessing ? "Connecting to Paystack..." : `Pay ₦${amount.toLocaleString()}`}
            </button>

          </form>
        )}
      </div>
    </main>
  );
}
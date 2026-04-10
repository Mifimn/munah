"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// This tells Next.js to NEVER render this component on the Vercel server
// It will only load when a real customer opens it in their browser
const CheckoutClient = dynamic(() => import("./CheckoutClient"), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-earth-silk flex justify-center items-center">
      <Loader2 size={40} className="animate-spin text-botanical-green/40" />
    </main>
  ),
});

export default function CheckoutPage() {
  return <CheckoutClient />;
}

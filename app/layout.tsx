import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";
import ConsultationToggle from "./components/ConsultationToggle";
import Footer from "./components/Footer";

// Configure Inter for clean, clinical sans-serif text (UI/Body)
const inter = Inter({ 
  subsets: ["latin"], 
  variable: "--font-inter",
  display: 'swap',
});

// Configure Playfair Display for elegant, apothecary serif (Headings/Italics)
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "naturalcareherbalmedicine | Clinical Botanical Apothecary",
  description: "Clinically-backed botanical remedies and ancestral herbal medicine. Access our digital ledger for targeted healing and professional consultations.",
  keywords: ["herbal medicine", "apothecary", "natural cures", "clinical botanicals", "Nigeria herbal medicine"],
  authors: [{ name: "naturalcareherbalmedicine" }],
  viewport: "width=device-width, initial-scale=1",
  openGraph: {
    title: "naturalcareherbalmedicine",
    description: "Premium Digital Apothecary & Botanical Research Library",
    url: "https://naturalcareherbalmedicine.com",
    siteName: "naturalcareherbalmedicine",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body 
        className={`${inter.variable} ${playfair.variable} font-sans bg-earth-silk text-botanical-green antialiased min-h-screen flex flex-col`}
      >
        {/* 1. Global Navigation (Icon Logo & Structured Index) */}
        <Sidebar />

        {/* 2. Contextual Consultation (Floating WhatsApp - Fades in on scroll) */}
        <ConsultationToggle />

        {/* 3. Main Content Area */}
        <main className="flex-grow relative">
          {children}
        </main>

        {/* 4. Clinical Footer (Contact Protocols & Social Archives) */}
        <Footer />
      </body>
    </html>
  );
}

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

// --- ADVANCED CLINICAL SEO & OG CONFIGURATION ---
export const metadata: Metadata = {
  metadataBase: new URL("https://naturalcureherbalmedicine.com"),
  title: {
    default: "naturalcureherbalmedicine | Clinical Botanical Apothecary",
    template: "%s | naturalcureherbalmedicine",
  },
  description: "Bridging ancestral botanical wisdom with modern clinical protocols. Hand-formulated remedies curated by Medinah Olagunju for targeted cellular healing.",
  keywords: [
    "Medinah Olagunju",
    "herbal medicine Nigeria",
    "botanical remedies",
    "natural apothecary",
    "ancestral healing",
    "clinical herbalism",
    "natural cures",
    "Mifimn",
    "Musa Ayoola Shittu"
  ],
  // Medinah is the owner/author for SEO authority
  authors: [{ name: "Medinah Olagunju", url: "https://naturalcureherbalmedicine.com" }],
  // Mifimn (Musa) is the technical creator/architect
  creator: "Shittu Musa Ayoola (Mifimn)",
  publisher: "naturalcureherbalmedicine",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Open Graph (Social Media Sharing)
  openGraph: {
    title: "naturalcureherbalmedicine | Digital Botanical Ledger",
    description: "Explore clinical archives of hand-formulated botanical remedies. Curated by Medinah Olagunju.",
    url: "https://naturalcureherbalmedicine.com",
    siteName: "naturalcureherbalmedicine",
    images: [
      {
        url: "/og-image.jpg", // Ensure this 1200x630px image exists in /public
        width: 1200,
        height: 630,
        alt: "naturalcureherbalmedicine Botanical Archive by Medinah Olagunju",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter/TikTok Card Integration
  twitter: {
    card: "summary_large_image",
    title: "naturalcureherbalmedicine | Clinical Apothecary",
    description: "Botanical science and ancestral healing by Medinah Olagunju.",
    images: ["/og-image.jpg"],
    creator: "@naturalcureherbalmedicine",
  },

  // Search Engine Robot Protocols
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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

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

// --- ADVANCED HYBRID SEO: APOTHECARY BRAND + CORE PRODUCTS ---
export const metadata: Metadata = {
  metadataBase: new URL("https://naturalcureherbalmedicine.com"),
  title: {
    // Branding as a Clinical Apothecary while highlighting the Honey & Milk for Search
    default: "Natural Cure | Clinical Apothecary, Original Honey & Camel Milk",
    template: "%s | naturalcureherbalmedicine",
  },
  description: "Nigeria's premier clinical apothecary specializing in hand-formulated remedies, 100% Original Wild Honey, and Undiluted Camel Milk. Curated by Modina Olagunju.",
  keywords: [
    "Original Honey Nigeria",
    "Undiluted Camel Milk Nigeria",
    "Raw Camel Milk",
    "Pure Wild Honey",
    "Modina Olagunju",
    "herbal medicine Nigeria",
    "botanical remedies",
    "natural apothecary",
    "ancestral healing",
    "clinical herbalism",
    "natural cures",
    "Mifimn",
    "Musa Ayoola Shittu"
  ],
  authors: [{ name: "Modina Olagunju", url: "https://naturalcureherbalmedicine.com" }],
  creator: "Shittu Musa Ayoola (Mifimn)",
  publisher: "Natural Cure Herbal Medicine",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Open Graph (Social Media Sharing)
  openGraph: {
    title: "naturalcureherbalmedicine | Clinical Apothecary & Superfoods",
    description: "Sourced from the wild, delivered with clinical purity. Explore our original honey, camel milk, and hand-formulated botanical archives.",
    url: "https://naturalcureherbalmedicine.com",
    siteName: "Natural Cure Herbal Medicine", 
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Natural Cure Original Honey and Camel Milk by Modina Olagunju",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Natural Cure | Original Honey & Camel Milk",
    description: "Botanical science, Original Honey, and Undiluted Camel Milk by Modina Olagunju.",
    images: ["/og-image.jpg"],
    creator: "@naturalcureherbalmedicine",
  },

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
  
  // --- UPDATED JSON-LD: INCLUDES PRODUCT SPECIALTIES ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Natural Cure Herbal Medicine",
    "alternateName": [
      "naturalcureherbalmedicine", 
      "Natural Cure Apothecary", 
      "Original Honey & Camel Milk Nigeria"
    ],
    "url": "https://naturalcureherbalmedicine.com/"
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Injecting the Structured Data directly into the HTML Head */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body 
        className={`${inter.variable} ${playfair.variable} font-sans bg-earth-silk text-botanical-green antialiased min-h-screen flex flex-col`}
      >
        <Sidebar />
        <ConsultationToggle />
        <main className="flex-grow relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

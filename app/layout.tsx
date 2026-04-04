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
    // We keep your title exact, but Google uses the Site Name for the top label
    default: "naturalcureherbalmedicine | Clinical Botanical Apothecary",
    template: "%s | naturalcureherbalmedicine",
  },
  description: "Bridging ancestral botanical wisdom with modern clinical protocols. Hand-formulated remedies curated by Modina Olagunju for targeted cellular healing.",
  keywords: [
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
    title: "naturalcureherbalmedicine | Digital Botanical Ledger",
    description: "Explore clinical archives of hand-formulated botanical remedies. Curated by Modina Olagunju.",
    url: "https://naturalcureherbalmedicine.com",
    // CRITICAL FIX: Use spaces here so Google sees a Brand Name, not a URL
    siteName: "Natural Cure Herbal Medicine", 
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "naturalcureherbalmedicine Botanical Archive by Modina Olagunju",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "naturalcureherbalmedicine | Clinical Apothecary",
    description: "Botanical science and ancestral healing by Modina Olagunju.",
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
  
  // --- THE "ZOHO" SECRET: JSON-LD STRUCTURED DATA ---
  // This explicitly tells Google the exact Site Name to display above the URL
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Natural Cure Herbal Medicine",
    "alternateName": ["naturalcureherbalmedicine", "Natural Cure Apothecary"],
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

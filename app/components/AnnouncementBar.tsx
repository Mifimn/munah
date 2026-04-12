import { ArrowRight } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <a 
      href="https://chat.whatsapp.com/L6J7JfIVSqn4Yo3dlZSiO4?mode=gi_t" 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-botanical-green text-clinical-white py-2.5 px-4 flex justify-center items-center gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-botanical-green/90 transition-colors w-full z-50 relative"
    >
      <span className="hidden sm:inline">🌿 Join our private WhatsApp community for daily natural food remedies</span>
      <span className="sm:hidden">🌿 Join our WhatsApp community</span>
      <ArrowRight size={14} className="animate-pulse" />
    </a>
  );
}
import { ArrowRight } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <a 
      href="https://chat.whatsapp.com/L6J7JfIVSqn4Yo3dlZSiO4?mode=gi_t" 
      target="_blank" 
      rel="noopener noreferrer"
      className="sticky top-0 z-[100] bg-botanical-green text-clinical-white py-3 px-4 flex justify-center items-center gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest hover:bg-botanical-green/90 transition-all w-full shadow-md"
    >
      {/* Desktop wording: Focuses on exclusivity and high value */}
      <span className="hidden sm:inline">🌿 Unlock exclusive healing recipes & daily ancestral remedies. Join our private WhatsApp circle</span>
      
      {/* Mobile wording: Short, punchy, and action-oriented */}
      <span className="sm:hidden">🌿 Get exclusive daily remedies via WhatsApp</span>
      
      <ArrowRight size={14} className="animate-pulse" />
    </a>
  );
}

"use client";

import { useState, useRef } from "react";
import { Play, Pause, User, Volume2 } from "lucide-react";

// --- THE REVIEW DATA ---
const REVIEWS = [
  {
    id: 0,
    name: "Ayinde",
    quote: "The remedies for brain health and memory have been incredibly effective. Thank you for the professional guidance!",
    audioSrc: "/audio/review1.opus" // WhatsApp voice note from Ayinde
  },
  {
    id: 1,
    name: "Ummu Anas",
    quote: "I am so happy with the results that I had to leave a review on Google. Truly wonderful natural products.",
    audioSrc: "/audio/review2.opus" // WhatsApp voice note from Ummu Anas
  },
  {
    id: 2,
    name: "International Client",
    quote: "We really miss the pure camel milk here in Malawi! The quality is unmatched and we need an agent here.",
    audioSrc: "/audio/review3.opus" // WhatsApp voice note from Malawi
  }
];

export default function AudioTestimonial() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0); 
  
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const togglePlay = (index: number) => {
    const targetAudio = audioRefs.current[index];

    if (!targetAudio) return;

    if (playingId === index) {
      targetAudio.pause();
      setPlayingId(null);
    } else {
      // Pause any other audio currently playing
      if (playingId !== null && audioRefs.current[playingId]) {
        audioRefs.current[playingId]?.pause();
      }
      targetAudio.play();
      setPlayingId(index);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const width = scrollContainerRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      setActiveIndex(newIndex);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* Swipeable Container for Mobile / Grid for Desktop */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 w-full max-w-[1200px] pb-2 md:grid md:grid-cols-3 md:overflow-visible no-scrollbar"
      >
        {REVIEWS.map((review, index) => (
          <div 
            key={review.id} 
            className="snap-center shrink-0 w-[85vw] md:w-auto bg-clinical-white p-6 md:p-8 border border-botanical-green/10 shadow-sm rounded-sm flex flex-col justify-between text-left"
          >
            
            <audio 
              ref={(el) => { audioRefs.current[index] = el; }} 
              src={review.audioSrc} 
              onEnded={() => setPlayingId(null)}
            />

            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 shrink-0 bg-botanical-green/10 rounded-full flex items-center justify-center text-botanical-green">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-botanical-green">{review.name}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-botanical-green/50 font-bold flex items-center gap-1">
                    <Volume2 size={10} /> WhatsApp Voice Note
                  </p>
                </div>
              </div>

              <p className="text-sm text-botanical-green/80 italic mb-8 leading-relaxed">
                "{review.quote}"
              </p>
            </div>

            <button 
              onClick={() => togglePlay(index)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-earth-silk border border-botanical-green/20 text-botanical-green rounded-full text-xs uppercase tracking-widest font-bold hover:bg-botanical-green hover:text-clinical-white transition-colors mt-auto"
            >
              {playingId === index ? <Pause size={14} /> : <Play size={14} />}
              {playingId === index ? "Pause Voice Note" : "Listen to Voice Note"}
            </button>
          </div>
        ))}
      </div>

      {/* Slider Indicators for Mobile View */}
      <div className="flex flex-col items-center mt-4 md:hidden">
        <div className="flex gap-2 mb-2">
          {REVIEWS.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === idx 
                  ? "w-6 bg-botanical-green" 
                  : "w-1.5 bg-botanical-green/20"
              }`}
            />
          ))}
        </div>
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-botanical-green/40">
          Swipe for more reviews
        </span>
      </div>

    </div>
  );
}

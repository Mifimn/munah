"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, User, Volume2 } from "lucide-react";

// --- THE REVIEW DATA ---
const REVIEWS = [
  {
    id: 0,
    name: "Customer 1",
    quote: "The sahur gruel is very okay and the fonyo is good. I still have the camel milk and plenty of the infection flusher remaining.",
    product: "Sahur Gruel, Fonyo, Camel Milk & Infection Flusher",
    audioSrc: "/audio/review1.opus" 
  },
  {
    id: 1,
    name: "Customer 2",
    quote: "I finished eating the product before you even told me to! It is so sweet and tastes very good. I will definitely ask for more.",
    product: "Natural Herbal Products",
    audioSrc: "/audio/review2.opus" 
  },
  {
    id: 2,
    name: "Customer 3",
    quote: "I have seen real changes in my body system. The sahur gruel is very relaxing and nourishing, and I completely finished the camel milk.",
    product: "Sahur Gruel & Camel Milk",
    audioSrc: "/audio/review3.opus" 
  },
  {
    id: 3,
    name: "Morenikeji",
    quote: "I seriously love your products! The sahur gruel and weight gain powder are perfectly okay for the body. May the Almighty give you more knowledge.",
    product: "Sahur Gruel & Weight Gain Powder",
    audioSrc: "/audio/review4.opus" 
  },
  {
    id: 4,
    name: "Customer 5",
    quote: "My daughter confirmed that the honey and camel milk are completely original. Thank you for assuring us that consuming it raw is safe and pure.",
    product: "Original Honey & Raw Camel Milk",
    audioSrc: "/audio/review5.opus" 
  }
];

export default function AudioTestimonial() {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0); 
  
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const hasAttemptedAutoplay = useRef(false);

  // --- SMART AUTOPLAY WITH FALLBACK ---
  useEffect(() => {
    // Find Morenikeji's index in the array
    const autoPlayIndex = REVIEWS.findIndex(review => review.name === "Morenikeji");
    
    // Small delay ensures the refs are fully attached to the DOM before trying
    const timer = setTimeout(() => {
      const targetAudio = audioRefs.current[autoPlayIndex];

      if (targetAudio && !hasAttemptedAutoplay.current) {
        hasAttemptedAutoplay.current = true;
        
        const attemptPlay = async () => {
          try {
            // 1. Try to play immediately
            await targetAudio.play();
            setPlayingId(autoPlayIndex);
          } catch (error) {
            console.warn("Browser blocked instant autoplay. Waiting for first interaction...");
            
            // 2. If blocked, wait for the user to click/tap/scroll anywhere on the site
            const playOnInteract = async () => {
              try {
                await targetAudio.play();
                setPlayingId(autoPlayIndex);
              } catch (e) {
                // Ignore if it still fails
              } finally {
                // Remove the listeners so it only happens once
                document.removeEventListener("click", playOnInteract);
                document.removeEventListener("touchstart", playOnInteract);
                document.removeEventListener("scroll", playOnInteract);
              }
            };

            document.addEventListener("click", playOnInteract);
            document.addEventListener("touchstart", playOnInteract);
            document.addEventListener("scroll", playOnInteract, { once: true });
          }
        };

        attemptPlay();
      }
    }, 500); // 500ms delay to ensure elements are mounted

    return () => clearTimeout(timer);
  }, []);

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
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 w-full max-w-[1200px] pb-2 md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible no-scrollbar"
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
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 shrink-0 bg-botanical-green/10 rounded-full flex items-center justify-center text-botanical-green">
                  <User size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-botanical-green">{review.name}</h4>
                  
                  {/* Dynamic Product Caption */}
                  <p className="text-[9px] uppercase tracking-widest text-botanical-green/50 font-bold flex items-start gap-1.5 leading-[1.4] mt-1">
                    <Volume2 size={12} className="shrink-0 mt-[1px]" />
                    <span>
                      Customer feedback about "Naturalcureherbalmedicine" <br />
                      <span className="text-botanical-green/80">{review.product}</span>
                    </span>
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
      <div className="flex flex-col items-center mt-6 md:hidden">
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

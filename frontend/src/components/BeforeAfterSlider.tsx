import { useState } from "react";

type Props = {
  image: string;
  imageNew: string;
  altText?: string;
};

export default function BeforeAfterSlider({ image, imageNew, altText = "Comparație istorică" }: Props) {
  const [sliderPos, setSliderPos] = useState(50); // Începe mereu fix de la jumătate

  return (
    <div className="relative w-full aspect-video overflow-hidden rounded-sm border border-border shadow-md select-none group">
      
      {/* 1. Imaginea NOUĂ (Stă pe fundal, dedesubt) */}
      <img 
        src={imageNew} 
        alt={`Prezent - ${altText}`} 
        className="absolute inset-0 h-full w-full object-cover" 
      />
      
      {/* 2. Imaginea VECHE (Stă deasupra, tăiată dinamic de clip-path) */}
      <img 
        src={image} 
        alt={`Trecut - ${altText}`} 
        className="absolute inset-0 h-full w-full object-cover sepia-[30%]"
        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
      />
      
      {/* 3. Glisorul nativ (range input) - Este făcut complet transparent! */}
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={sliderPos} 
        onChange={(e) => setSliderPos(Number(e.target.value))}
        className="absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0 m-0"
      />
      
      {/* 4. Linia vizuală despărțitoare (urmărește inputul transparent) */}
      <div 
        className="absolute bottom-0 top-0 w-1 bg-paper shadow-[0_0_10px_rgba(40,15,10,0.8)] pointer-events-none transition-transform duration-75"
        style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
      >
        {/* Cercul (mânerul) de tras */}
        <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent border-2 border-paper text-paper shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="rotate-180 absolute">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </div>
      </div>
      
      {/* Etichete ajutătoare (Apar doar când faci hover peste poză) */}
      <div className="absolute top-3 left-3 z-0 rounded bg-ink/70 px-2 py-1 font-type text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100">
        1980
      </div>
      <div className="absolute top-3 right-3 z-0 rounded bg-ink/70 px-2 py-1 font-type text-xs text-paper opacity-0 transition-opacity group-hover:opacity-100">
        Prezent
      </div>
      
    </div>
  );
}
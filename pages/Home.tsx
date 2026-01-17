
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background with parallax effect simulation */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1920" 
          className="w-full h-full object-cover grayscale opacity-40 scale-105"
          alt="Mountains"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl pt-20">
        <div className="inline-block mb-8 py-1 px-3 border border-accent/30 rounded-full">
           <p className="text-accent uppercase tracking-[6px] text-[10px] font-bold">Trentino • Alps • Worldwide</p>
        </div>
        
        <h1 className="text-6xl md:text-[12rem] font-serif font-bold mb-8 leading-[0.9] tracking-tighter">
          Giordano <br /> Faletti
        </h1>
        
        <p className="text-base md:text-xl text-white/60 font-light mb-12 max-w-2xl mx-auto leading-relaxed">
          UIAGM Certified Mountain Guide & Ski Instructor.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link to="/routes" className="group relative w-full sm:w-auto px-12 py-5 overflow-hidden">
            <div className="absolute inset-0 bg-accent transition-transform duration-300 group-hover:scale-105" />
            <span className="relative z-10 text-white uppercase tracking-[3px] text-[11px] font-bold">Explore Routes</span>
          </Link>
          <Link to="/contact" className="group w-full sm:w-auto px-12 py-5 border border-white/20 hover:border-accent transition-all duration-300">
            <span className="text-white group-hover:text-accent uppercase tracking-[3px] text-[11px] font-bold transition-colors">Book Experience</span>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-30">
        <span className="text-[10px] uppercase tracking-[4px]">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white to-transparent" />
      </div>
    </div>
  );
};

export default Home;

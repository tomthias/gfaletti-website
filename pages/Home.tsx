
import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img 
          src="https://raw.githubusercontent.com/tomthias/gfaletti-website/tomthias-patch-1/assets/main/bg-darkmode.png" 
          className="w-full h-full object-cover scale-110 opacity-60 grayscale-[40%] animate-[subtle-zoom_20s_infinite_alternate]"
          alt="Mountains"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#0a0a0a]" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-6xl animate-in fade-in zoom-in duration-1000">
        <div className="inline-block mb-10 py-1.5 px-6 border border-white/10 rounded-full backdrop-blur-xl bg-white/5">
           <p className="text-white uppercase tracking-[10px] text-[9px] font-bold">Trentino • Alps • Dolomites</p>
        </div>
        
        <h1 className="text-7xl md:text-[6rem] font-serif font-bold mb-5 leading-[0.8] tracking-tighter">
          Giordano Faletti
        </h1>
        
        <p className="text-lg md:text-2xl text-white/70 font-serif mb-16 max-w-3xl mx-auto leading-relaxed italic tracking-wide">
          Guida Alpina Internazionale UIAGM IFMGA IVBV e Maestro di Sci.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
          <Link to="/routes" className="group relative w-full sm:w-auto px-16 py-6 overflow-hidden rounded-sm transition-all duration-500 shadow-2xl shadow-accent/20">
            <div className="absolute inset-0 bg-accent transition-transform duration-500 group-hover:scale-110" />
            <span className="relative z-10 text-white uppercase tracking-[5px] text-[11px] font-bold">Explore Routes</span>
          </Link>
          <Link to="/contact" className="group w-full sm:w-auto px-16 py-6 border border-white/10 backdrop-blur-md bg-white/5 rounded-sm hover:bg-white hover:border-white transition-all duration-500">
            <span className="text-white group-hover:text-black uppercase tracking-[5px] text-[11px] font-bold transition-colors">Book Experience</span>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes subtle-zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
};

export default Home;

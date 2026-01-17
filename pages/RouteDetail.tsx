
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTES_DATA } from '../constants';
import { RouteTopo } from '../components/Topos';

const RouteDetail = () => {
  const { id } = useParams();
  const route = ROUTES_DATA.find(r => r.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!route) return <div className="p-20 text-center">Route not found.</div>;

  return (
    <div className="pb-20">
      {/* Hero */}
      <header className="relative h-[85vh] w-full overflow-hidden">
        <img 
          src={route.mainImage} 
          className="absolute inset-0 w-full h-full object-cover opacity-60" 
          alt={route.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/20 to-transparent" />
        
        {/* Content Container */}
        <div className="absolute inset-0 w-full max-w-7xl mx-auto">
            {/* Text Section - Bottom aligned */}
            <div className="absolute bottom-0 left-0 p-6 md:p-20 w-full md:max-w-4xl flex flex-col items-start justify-end h-full pointer-events-none">
                <div className="pointer-events-auto">
                    <Link to="/routes" className="inline-flex items-center gap-2 text-white/60 hover:text-accent transition-colors text-xs uppercase tracking-widest mb-10">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Back to Routes
                    </Link>
                    
                    <div className="flex flex-wrap gap-3 mb-8">
                    {route.tags.map(tag => (
                        <span key={tag} className="px-4 py-1 rounded-full border border-accent/30 bg-accent/10 backdrop-blur-md text-accent text-[10px] font-bold uppercase tracking-widest shadow-[0_0_10px_rgba(68,173,194,0.1)] hover:bg-accent hover:text-white transition-all duration-300">
                        {tag}
                        </span>
                    ))}
                    </div>

                    <h1 className="text-5xl md:text-9xl font-serif font-bold mb-4">{route.title}</h1>
                    <p className="text-xl md:text-2xl text-white/60 font-serif italic">{route.subtitle}</p>
                </div>
            </div>

            {/* Topo Section - Top Right Position - No Background */}
            <div className="hidden lg:block absolute right-6 md:right-20 top-32 pointer-events-auto z-20 animate-in fade-in slide-in-from-right-8 duration-1000">
                 <div className="w-[120px] flex flex-col items-center">
                     <h4 className="text-[9px] uppercase tracking-widest text-white/50 mb-4 w-full text-center font-bold">Route Topo</h4>
                     <div className="w-full drop-shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-90 hover:opacity-100 transition-opacity duration-300">
                        <RouteTopo id={route.id} />
                     </div>
                 </div>
            </div>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-6xl mx-auto px-6 mt-20 grid lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-12">
          <section>
            <p className="text-2xl md:text-3xl leading-relaxed font-serif italic border-l-2 border-accent pl-8 mb-16 text-white/80">
              "{route.lead}"
            </p>
            <h2 className="text-xs uppercase tracking-[4px] text-accent font-bold mb-6">The Story</h2>
            <div className="text-lg text-white/60 leading-loose space-y-6 font-light">
              <p>{route.story}</p>
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-10 py-10 border-y border-white/10">
            <div>
              <h3 className="text-xs uppercase tracking-[4px] text-accent font-bold mb-6">Approach</h3>
              <p className="text-white/60 font-light">{route.approach}</p>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-[4px] text-accent font-bold mb-6">Descent</h3>
              <p className="text-white/60 font-light">{route.descent}</p>
            </div>
          </div>

          <section>
             <h2 className="text-xs uppercase tracking-[4px] text-accent font-bold mb-10">Gallery</h2>
             <div className="columns-1 md:columns-2 gap-4 space-y-4">
               {route.gallery.map((img, i) => (
                 <div key={i} className="break-inside-avoid">
                   <img src={img} alt="Gallery item" className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-500 cursor-zoom-in rounded-sm" />
                 </div>
               ))}
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-12 h-fit sticky top-32">
          
          <div className="bg-white/5 border border-white/10 p-8 rounded-lg space-y-8">
            <div>
              <h4 className="text-[10px] uppercase tracking-[3px] text-accent font-bold mb-4">Technical Details</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Difficulty</span>
                  <span className="font-bold">{route.difficulty}</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Length</span>
                  <span className="font-bold">{route.length}</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Aspect</span>
                  <span className="font-bold">{route.aspect}</span>
                </li>
                <li className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-white/40">Date</span>
                  <span className="font-bold">{route.date}</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[3px] text-accent font-bold mb-4">Recommended Gear</h4>
              <div className="flex flex-wrap gap-2">
                {route.gear.map(g => (
                  <span key={g} className="text-[10px] px-2 py-1 bg-white/10 text-white/60 rounded">{g}</span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[10px] uppercase tracking-[3px] text-accent font-bold mb-4">Climbers</h4>
              <div className="space-y-1">
                {route.climbers.map(c => (
                  <div key={c} className="text-sm font-medium">{c}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 border border-accent/30 rounded-lg text-center">
            <h4 className="text-accent text-sm font-bold mb-4">Interested in this route?</h4>
            <Link to="/contact" className="block w-full py-3 bg-accent text-white uppercase text-xs tracking-widest font-bold hover:bg-[#184953] transition-colors">
              Book the experience
            </Link>
          </div>
        </aside>
      </article>
    </div>
  );
};

export default RouteDetail;

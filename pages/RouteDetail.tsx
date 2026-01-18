
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ROUTES_DATA } from '../constants';
import { RouteTopo } from '../components/Topos';

const RouteDetail = () => {
  const { id } = useParams();
  const route = ROUTES_DATA.find(r => r.id === id);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleDownload = async (e: React.MouseEvent) => {
    if (!route?.sketchImage) return;
    e.preventDefault();
    // Fix: replaced non-existent setIsGenerating with setIsDownloading
    setIsDownloading(true);

    try {
      const response = await fetch(route.sketchImage, { mode: 'cors' });
      if (!response.ok) throw new Error('Network response was not ok');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `topo-${route.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
      const fallbackLink = document.createElement('a');
      fallbackLink.href = route.sketchImage;
      fallbackLink.target = '_blank';
      fallbackLink.rel = 'noopener noreferrer';
      fallbackLink.click();
    } finally {
      setIsDownloading(false);
    }
  };

  if (!route) return <div className="p-20 text-center text-white/40">Route not found.</div>;

  return (
    <div className="pb-32 bg-[#0a0a0a]">
      {/* Hero Header - Rimosso overflow-hidden */}
      <header className="relative h-[95vh] w-full">
        <img 
          src={route.mainImage} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale-[10%]" 
          alt={route.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/30 to-black/10" />
        
        <div className="absolute inset-0 w-full max-w-7xl mx-auto pointer-events-none">
            <div className="absolute bottom-0 left-0 p-6 md:p-20 w-full md:max-w-5xl flex flex-col items-start justify-end h-full">
                <div className="pointer-events-auto">
                    <Link to="/routes" className="inline-flex items-center gap-3 text-white/50 hover:text-accent transition-colors text-[10px] uppercase tracking-[4px] font-bold mb-12">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                      Back to Routes
                    </Link>
                    
                    <div className="flex flex-wrap gap-3 mb-10">
                    {route.tags.map(tag => (
                        <span key={tag} className="px-5 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/60 text-[9px] font-bold uppercase tracking-[3px]">
                        {tag}
                        </span>
                    ))}
                    </div>

                    <h1 className="text-7xl md:text-[11rem] font-serif font-bold mb-6 leading-none tracking-tighter opacity-90">{route.title}</h1>
                    <p className="text-xl md:text-3xl text-white/40 font-serif italic tracking-wide">{route.subtitle}</p>
                </div>
            </div>

            {/* Topo Overlay - Senza effetti hover-scale e con margini ottimizzati */}
            <div className="hidden lg:block absolute right-12 md:right-24 bottom-8 top-20 pointer-events-auto z-20">
                 <div className="w-[140px] h-full flex flex-col items-center justify-center">
                     <div className="h-full w-full flex items-center justify-center">
                        <RouteTopo id={route.id} />
                     </div>
                 </div>
            </div>
        </div>
      </header>

      {/* Resto del contenuto invariato */}
      <article className="max-w-7xl mx-auto px-6 mt-32">
        <div className="grid lg:grid-cols-3 gap-24">
          <div className="lg:col-span-2 space-y-20">
            <section>
              <p className="text-3xl md:text-4xl leading-relaxed font-serif italic border-l-4 border-accent pl-10 mb-20 text-white/80">
                "{route.lead}"
              </p>
              <div className="text-xl text-white/50 leading-loose space-y-8 font-light max-w-4xl">
                <p>{route.story}</p>
              </div>
            </section>

            <div className="grid md:grid-cols-2 gap-16 py-16 border-y border-white/5">
              <div>
                <h3 className="text-xs uppercase tracking-[5px] text-accent font-bold mb-8">Access Approach</h3>
                <p className="text-white/50 font-light leading-relaxed text-lg">{route.approach}</p>
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-[5px] text-accent font-bold mb-8">Return Descent</h3>
                <p className="text-white/50 font-light leading-relaxed text-lg">{route.descent}</p>
              </div>
            </div>

            {route.sketchImage && (
              <section className="pt-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-12">
                  <div>
                    <h2 className="text-xs uppercase tracking-[5px] text-accent font-bold mb-3">Field Notes</h2>
                  </div>
                  <button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`inline-flex items-center gap-4 px-10 py-5 bg-white text-black uppercase text-[10px] tracking-[4px] font-bold hover:bg-accent hover:text-white transition-all duration-500 rounded-sm ${isDownloading ? 'opacity-50 cursor-wait' : ''}`}
                  >
                    {isDownloading ? 'Processing...' : 'Download High-Res Topo'}
                  </button>
                </div>
                
                <div className="relative group overflow-hidden bg-white/5 p-4 rounded-sm border border-white/5 shadow-2xl">
                  <img 
                    src={route.sketchImage} 
                    alt="Technical Drawn Route" 
                    className="w-full h-auto transition-all duration-1000 group-hover:scale-[1.02]" 
                  />
                </div>
              </section>
            )}

            <section>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {route.gallery.map((img, i) => (
                   <div key={i} className="overflow-hidden bg-white/5 rounded-sm aspect-[4/5] relative group">
                     <img 
                        src={img} 
                        alt="Gallery item" 
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 cursor-zoom-in scale-100 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                   </div>
                 ))}
               </div>
            </section>
          </div>

          <aside className="space-y-16 h-fit sticky top-40">
            <div className="bg-white/[0.02] border border-white/5 p-12 rounded-sm space-y-12">
              <div>
                <h4 className="text-[10px] uppercase tracking-[5px] text-accent font-bold mb-8">Technical Data</h4>
                <ul className="space-y-6 text-sm">
                  <li className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-white/30 uppercase tracking-widest text-[9px]">Grade</span>
                    <span className="font-bold tracking-tight text-lg">{route.difficulty}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-white/30 uppercase tracking-widest text-[9px]">Vertical</span>
                    <span className="font-bold tracking-tight text-lg">{route.length}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-white/30 uppercase tracking-widest text-[9px]">Exposure</span>
                    <span className="font-bold tracking-tight text-lg">{route.aspect}</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-4">
                    <span className="text-white/30 uppercase tracking-widest text-[9px]">First Ascent</span>
                    <span className="font-bold tracking-tight text-lg">{route.date}</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-[5px] text-accent font-bold mb-8">Suggested Gear</h4>
                <div className="flex flex-wrap gap-3">
                  {route.gear.map(g => (
                    <span key={g} className="text-[9px] uppercase tracking-[2px] px-4 py-2 bg-white/5 text-white/50 rounded-full border border-white/5">{g}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-[10px] uppercase tracking-[5px] text-accent font-bold mb-8">The Team</h4>
                <div className="space-y-4">
                  {route.climbers.map(c => (
                    <div key={c} className="text-md font-serif italic text-white/60">{c}</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-12 border border-accent/20 bg-accent/5 rounded-sm text-center">
              <h4 className="text-accent text-xs font-bold mb-8 uppercase tracking-[4px]">Private Guiding</h4>
              <Link to="/contact" className="block w-full py-6 bg-accent text-white uppercase text-[10px] tracking-[5px] font-bold hover:shadow-[0_0_50px_rgba(68,173,194,0.4)] transition-all duration-500">
                Book Ascent
              </Link>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
};

export default RouteDetail;

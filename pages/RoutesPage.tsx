
import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES_DATA } from '../constants';

const RoutesPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <h2 className="text-accent uppercase tracking-[4px] text-xs font-semibold mb-2">Portfolio</h2>
        <h1 className="text-5xl font-serif italic">Signature Routes</h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {ROUTES_DATA.map(route => (
          <Link 
            key={route.id} 
            to={`/routes/${route.id}`}
            className="group relative block overflow-hidden"
          >
            <div className="aspect-[16/10] overflow-hidden mb-6">
              <img 
                src={route.mainImage} 
                alt={route.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <h3 className="text-2xl font-serif">{route.title}</h3>
                <span className="text-accent text-xs font-bold tracking-widest">{route.difficulty}</span>
              </div>
              <p className="text-white/40 text-sm">{route.subtitle}</p>
              <div className="pt-4 flex gap-2">
                {route.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="text-[10px] uppercase border border-white/10 px-2 py-1 text-white/40">{tag}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RoutesPage;

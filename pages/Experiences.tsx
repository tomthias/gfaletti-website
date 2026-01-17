
import React from 'react';
import { EXPERIENCES_DATA } from '../constants';

const Experiences = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="mb-20 text-center">
        <h2 className="text-accent uppercase tracking-[4px] text-xs font-semibold mb-2">History</h2>
        <h1 className="text-5xl font-serif italic">Expeditions & Awards</h1>
      </div>

      <div className="space-y-0">
        {EXPERIENCES_DATA.map((exp, idx) => (
          <div key={idx} className="flex group border-l border-white/10">
            <div className="w-32 -ml-[1px] pt-1">
               <div className="flex items-center">
                 <div className="w-3 h-3 bg-accent rounded-full -ml-[6px] group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(68,173,194,0.5)]" />
                 <span className="ml-6 text-accent font-bold text-sm tracking-widest">{exp.year}</span>
               </div>
            </div>
            <div className="flex-1 pb-20 pl-10 pt-1">
              <h3 className="text-2xl font-serif mb-3 group-hover:text-accent transition-colors">{exp.title}</h3>
              <p className="text-white/40 font-light leading-relaxed max-w-lg">
                {exp.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Experiences;


import React from 'react';
import { COURSES_DATA } from '../constants';

const Courses = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-20">
        <h2 className="text-accent uppercase tracking-[4px] text-xs font-semibold mb-2">Education</h2>
        <h1 className="text-5xl font-serif italic">Academy & Guiding</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {COURSES_DATA.map(course => (
          <div key={course.id} className="group p-10 bg-white/5 border border-white/10 hover:border-accent/50 transition-all">
            <div className="text-accent mb-10 opacity-60 group-hover:opacity-100 transition-opacity">
               <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1" viewBox="0 0 24 24">
                 {course.icon === 'Snowflake' && <path d="M12 2v20M2 12h20M7 7l10 10M17 7L7 10" />}
                 {course.icon === 'Radio' && <path d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5" />}
                 {course.icon === 'Mountain' && <path d="M3 20l9-16 9 16H3z" />}
               </svg>
            </div>
            <h3 className="text-2xl font-serif mb-4">{course.title}</h3>
            <p className="text-white/40 font-light leading-relaxed mb-8">
              {course.description}
            </p>
            <button className="text-[10px] uppercase tracking-widest text-accent font-bold border-b border-accent/0 hover:border-accent transition-all">
              Request Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;

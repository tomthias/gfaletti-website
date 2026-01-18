
import React from 'react';

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-32 min-h-[80vh] flex flex-col items-center justify-center bg-[#0a0a0a]">
      <div className="text-center mb-16">
        <h2 className="text-accent uppercase tracking-[4px] text-xs font-semibold mb-2">Connect</h2>
        <h1 className="text-5xl font-serif italic mb-8">Start your next ascent</h1>
        <p className="text-white/40 max-w-xl mx-auto font-light leading-relaxed">
          Whether you're looking for a private guide, professional certification, or just advice on a route, I'm here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 w-full max-w-4xl">
        <div className="bg-white/5 border border-white/10 p-12 text-center hover:bg-white/10 transition-colors">
          <h3 className="text-[10px] uppercase tracking-widest text-accent font-bold mb-4">Direct Email</h3>
          <a href="mailto:g.faletti@gmail.com" className="text-2xl font-serif text-white hover:text-accent transition-colors underline decoration-accent/30 underline-offset-8">
            g.faletti@gmail.com
          </a>
        </div>
        
        <div className="bg-white/5 border border-white/10 p-12 text-center hover:bg-white/10 transition-colors">
          <h3 className="text-[10px] uppercase tracking-widest text-accent font-bold mb-4">Follow</h3>
          <a href="https://instagram.com/giordanofaletti" target="_blank" rel="noopener noreferrer" className="text-2xl font-serif text-white hover:text-accent transition-colors underline decoration-accent/30 underline-offset-8">
            @giordanofaletti
          </a>
        </div>
      </div>

      <div className="mt-20 text-[10px] uppercase tracking-[4px] text-white/30">
        Based in Trentino, IT
      </div>
    </div>
  );
};

export default Contact;

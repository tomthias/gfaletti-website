
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RoutesPage from './pages/RoutesPage';
import RouteDetail from './pages/RouteDetail';
import Courses from './pages/Courses';
import Experiences from './pages/Experiences';
import Contact from './pages/Contact';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Routes', path: '/routes' },
    { name: 'Courses', path: '/courses' },
    { name: 'Experiences', path: '/experiences' },
    { name: 'Contact', path: '/contact' }
  ];

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] h-20 px-6 sm:px-12 flex justify-between items-center transition-all duration-300">
        {/* Background Overlay with Blur */}
        <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5 pointer-events-none" />
        
        {/* Brand Logo - Fixed Letter Spacing */}
        <Link 
          to="/" 
          className="relative z-[110] text-sm sm:text-lg font-bold tracking-[0.15em] uppercase font-serif hover:text-accent transition-colors"
        >
          GIORDANO FALETTI
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex gap-10 relative z-[110]">
          {navLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path}
              className={`text-[10px] uppercase tracking-[3px] transition-all hover:text-accent ${
                location.pathname.startsWith(link.path) ? 'text-accent font-bold' : 'text-white/50'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Improved Hamburger Toggle - No Mask Overflow */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="relative z-[110] w-12 h-12 flex flex-col items-center justify-center md:hidden focus:outline-none"
          aria-label="Toggle Menu"
        >
          <div className="relative w-6 h-5">
            <span 
              className={`absolute left-0 block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                isOpen ? 'top-2 rotate-45' : 'top-0'
              }`} 
            />
            <span 
              className={`absolute left-0 top-2 block w-4 h-0.5 bg-white transition-all duration-200 ease-in-out ml-auto right-0 ${
                isOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
              }`} 
            />
            <span 
              className={`absolute left-0 block w-6 h-0.5 bg-white transition-all duration-300 ease-in-out ${
                isOpen ? 'top-2 -rotate-45' : 'top-4'
              }`} 
            />
          </div>
        </button>
      </nav>

      {/* Fullscreen Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[90] bg-black transition-all duration-500 ease-in-out md:hidden ${
          isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-full invisible pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full px-6 text-center space-y-10">
          {navLinks.map((link, i) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-4xl font-serif font-light tracking-wide transition-all duration-500 transform ${
                isOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
              }`}
              style={{ transitionDelay: `${150 + i * 80}ms` }}
            >
              <span className={location.pathname === link.path ? 'text-accent italic font-normal underline decoration-accent/30 underline-offset-8' : 'text-white hover:text-accent transition-colors'}>
                {link.name}
              </span>
            </Link>
          ))}
          
          <div 
            className={`mt-16 pt-8 border-t border-white/5 w-48 transition-all duration-700 delay-500 transform ${
              isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <p className="text-[10px] uppercase tracking-[5px] text-white/30 font-medium">
              Trentino • Alps
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-accent selection:text-black flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/routes/:id" element={<RouteDetail />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <footer className="py-12 px-6 text-center text-white/20 text-[9px] tracking-[4px] uppercase border-t border-white/5 mt-20">
        © 2025 Giordano Faletti · Mountain Guide UIAGM
      </footer>
    </div>
  );
};

export default App;

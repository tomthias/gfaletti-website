
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RoutesPage from './pages/RoutesPage';
import RouteDetail from './pages/RouteDetail';
import Courses from './pages/Courses';
import Experiences from './pages/Experiences';
import Contact from './pages/Contact';
import Admin from './pages/Admin';

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

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-[100] h-24 px-6 sm:px-16 flex justify-between items-center transition-all duration-500">
        <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 pointer-events-none" />
        
        <Link 
          to="/" 
          className="relative z-[110] text-sm sm:text-lg font-bold tracking-[0.2em] uppercase font-serif text-white hover:text-accent transition-all"
        >
          GIORDANO FALETTI
        </Link>
        
        <div className="hidden md:flex gap-14 relative z-[110]">
          {navLinks.map(link => (
            <Link 
              key={link.path}
              to={link.path}
              className={`text-[10px] uppercase tracking-[4px] transition-all hover:text-accent group relative ${
                location.pathname.startsWith(link.path) ? 'text-accent' : 'text-white/40'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-2 left-0 h-[1px] bg-accent transition-all duration-500 ${location.pathname.startsWith(link.path) ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
          <Link to="/admin" className="text-[10px] uppercase tracking-[4px] text-white/10 hover:text-accent transition-colors">
            Portal
          </Link>
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="relative z-[110] md:hidden text-white p-2">
           <div className="w-6 h-4 flex flex-col justify-between items-end">
              <span className={`h-[1px] bg-white transition-all duration-300 ${isOpen ? 'w-6 rotate-45 translate-y-[7.5px]' : 'w-6'}`} />
              <span className={`h-[1px] bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : 'w-4'}`} />
              <span className={`h-[1px] bg-white transition-all duration-300 ${isOpen ? 'w-6 -rotate-45 -translate-y-[7.5px]' : 'w-6'}`} />
           </div>
        </button>
      </nav>

      <div className={`fixed inset-0 z-[90] bg-[#0a0a0a] transition-all duration-700 ease-in-out md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="flex flex-col items-center justify-center h-full space-y-12">
          {navLinks.map((link, i) => (
            <Link key={link.path} to={link.path} className="text-5xl font-serif italic text-white hover:text-accent transition-colors">
              {link.name}
            </Link>
          ))}
          <Link to="/admin" className="text-xs uppercase tracking-widest text-white/20">Admin Access</Link>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  // Scroll to top on every route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col relative selection:bg-accent/30 selection:text-accent">
      <Navbar />
      
      {/* 
        Il wrapper principale utilizza la pathname come key. 
        Questo forza il re-mount del componente Routes e innesca l'animazione CSS fadeInUp definita in index.html 
      */}
      <main className="flex-grow flex flex-col">
        <div key={location.pathname} className="animate-page-entry flex-grow flex flex-col">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/routes" element={<RoutesPage />} />
            <Route path="/routes/:id" element={<RouteDetail />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/experiences" element={<Experiences />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </div>
      </main>
      
      <footer className={`py-8 px-6 text-center border-white/5 ${isHome ? 'absolute bottom-0 left-0 w-full border-t-0 z-20' : 'mt-24 border-t'}`}>
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          {/* Footer content intentionally minimal per design request */}
        </div>
      </footer>
    </div>
  );
};

export default App;
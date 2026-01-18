
import React, { useState, useEffect } from 'react';
import { Route } from '../types';
import { getRoutes } from '../constants';
import { GoogleGenAI } from "@google/genai";

const Admin = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState<Partial<Route>>({
    id: '', title: '', subtitle: '', difficulty: '', length: '',
    aspect: '', date: '', tags: [], mainImage: '', sketchImage: '',
    gallery: [], lead: '', story: '', approach: '', descent: '',
    gear: [], climbers: []
  });

  useEffect(() => {
    setRoutes(getRoutes());
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleListChange = (name: keyof Route, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item !== '');
    setFormData(prev => ({ ...prev, [name]: items }));
  };

  const handleSave = () => {
    if (!formData.title) return alert("Inserisci almeno un titolo");
    const id = formData.title.toLowerCase().replace(/\s+/g, '-');
    const newRoute = { ...formData, id } as Route;
    const stored = localStorage.getItem('gfaletti_custom_routes');
    const customRoutes = stored ? JSON.parse(stored) : [];
    localStorage.setItem('gfaletti_custom_routes', JSON.stringify([...customRoutes, newRoute]));
    setRoutes(getRoutes());
    setIsEditing(false);
    resetForm();
    alert("Rotta salvata correttamente.");
  };

  const resetForm = () => {
    setFormData({
      id: '', title: '', subtitle: '', difficulty: '', length: '',
      aspect: '', date: '', tags: [], mainImage: '', sketchImage: '',
      gallery: [], lead: '', story: '', approach: '', descent: '',
      gear: [], climbers: []
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Eliminare definitivamente questa rotta?")) return;
    const stored = localStorage.getItem('gfaletti_custom_routes');
    if (stored) {
      const updated = JSON.parse(stored).filter((r: Route) => r.id !== id);
      localStorage.setItem('gfaletti_custom_routes', JSON.stringify(updated));
      setRoutes(getRoutes());
    }
  };

  const generateWithAI = async () => {
    if (!formData.title) return alert("Inserisci il titolo della via per l'AI");
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Sei l'assistente editoriale di Giordano Faletti. 
      Scrivi testi evocativi per: ${formData.title} (${formData.subtitle}). 
      Note tecniche: ${formData.difficulty}, ${formData.length}. 
      Tono: Alpinismo eroico e moderno.
      Restituisci JSON: {"lead": "...", "story": "..."}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      const data = JSON.parse(response.text);
      setFormData(prev => ({ ...prev, lead: data.lead, story: data.story }));
    } catch (e) {
      alert("Errore AI. Controlla la connessione.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-40 min-h-screen bg-[#0a0a0a]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 gap-8">
        <div>
          <h2 className="text-accent uppercase tracking-[6px] text-[10px] font-bold mb-3">Management Console</h2>
          <h1 className="text-6xl font-serif italic tracking-tight">Routes Editor</h1>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="group relative px-10 py-4 bg-white text-black uppercase text-[10px] tracking-widest font-bold hover:bg-accent hover:text-white transition-all duration-500"
          >
            Create New Route
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Section: Basic Info */}
          <section className="bg-white/[0.02] border border-white/5 p-12 space-y-8">
            <h3 className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold border-b border-white/5 pb-4 mb-8">1. Identity & Grade</h3>
            <div className="grid md:grid-cols-3 gap-10">
              <Field label="Title" name="title" value={formData.title} onChange={handleInputChange} placeholder="E.g. The Last Breath" />
              <Field label="Location / Subtitle" name="subtitle" value={formData.subtitle} onChange={handleInputChange} placeholder="E.g. Marmolada, South Face" />
              <Field label="Difficulty Grade" name="difficulty" value={formData.difficulty} onChange={handleInputChange} placeholder="E.g. VIII- / 7a+" />
            </div>
            <div className="grid md:grid-cols-4 gap-10">
              <Field label="Length" name="length" value={formData.length} onChange={handleInputChange} placeholder="350m" />
              <Field label="Exposure" name="aspect" value={formData.aspect} onChange={handleInputChange} placeholder="N-NW" />
              <Field label="Opening Date" name="date" value={formData.date} onChange={handleInputChange} placeholder="Spring 2024" />
              <Field label="Tags (comma separated)" name="tags" value={formData.tags?.join(', ')} onChange={(e) => handleListChange('tags', e.target.value)} placeholder="Trad, Mixed..." />
            </div>
          </section>

          {/* Section: Storytelling */}
          <section className="bg-white/[0.02] border border-white/5 p-12 space-y-8">
            <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-8">
               <h3 className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold">2. The Narrative</h3>
               <button 
                 onClick={generateWithAI} 
                 disabled={isGenerating}
                 className="text-[10px] uppercase tracking-widest text-accent px-4 py-2 border border-accent/20 hover:bg-accent/10 transition-all flex items-center gap-2"
               >
                 {isGenerating ? 'AI Thinking...' : '✨ Polish with Gemini'}
               </button>
            </div>
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[9px] uppercase text-white/40 tracking-widest block">Short Lead</label>
                <input name="lead" value={formData.lead} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 p-4 text-sm font-serif italic focus:border-accent outline-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase text-white/40 tracking-widest block">Full Story</label>
                <textarea name="story" value={formData.story} onChange={handleInputChange} rows={6} className="w-full bg-white/5 border border-white/10 p-4 text-sm leading-relaxed focus:border-accent outline-none" />
              </div>
            </div>
          </section>

          {/* Section: Technicals */}
          <section className="bg-white/[0.02] border border-white/5 p-12 space-y-8">
            <h3 className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold border-b border-white/5 pb-4 mb-8">3. Technical Access</h3>
            <div className="grid md:grid-cols-2 gap-10">
              <Field label="Approach" name="approach" value={formData.approach} onChange={handleInputChange} isTextArea />
              <Field label="Descent" name="descent" value={formData.descent} onChange={handleInputChange} isTextArea />
            </div>
          </section>

          {/* Section: Media */}
          <section className="bg-white/[0.02] border border-white/5 p-12 space-y-8">
            <h3 className="text-[10px] uppercase tracking-[4px] text-white/30 font-bold border-b border-white/5 pb-4 mb-8">4. Visual Assets</h3>
            <div className="grid md:grid-cols-2 gap-10">
              <Field label="Main Hero Image URL" name="mainImage" value={formData.mainImage} onChange={handleInputChange} />
              <Field label="Technical Sketch URL" name="sketchImage" value={formData.sketchImage} onChange={handleInputChange} />
            </div>
          </section>

          <div className="flex gap-6 pt-12">
            <button onClick={handleSave} className="flex-1 py-6 bg-accent text-white uppercase text-xs tracking-[6px] font-bold hover:shadow-[0_0_40px_rgba(68,173,194,0.3)] transition-all">Publish Route</button>
            <button onClick={() => setIsEditing(false)} className="px-16 py-6 border border-white/10 text-white uppercase text-xs tracking-[6px] hover:bg-white/5 transition-all">Discard</button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {routes.map(r => (
            <div key={r.id} className="group flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 hover:border-accent/30 hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-10">
                <div className="w-24 h-24 bg-white/5 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img src={r.mainImage} alt="" className="w-full h-full object-cover opacity-60" />
                </div>
                <div>
                  <h3 className="text-2xl font-serif mb-1">{r.title}</h3>
                  <p className="text-white/30 text-[10px] uppercase tracking-widest">{r.subtitle} • {r.difficulty}</p>
                </div>
              </div>
              <div className="flex gap-8 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                <button className="text-[10px] uppercase tracking-widest text-accent font-bold">Edit</button>
                <button onClick={() => handleDelete(r.id)} className="text-[10px] uppercase tracking-widest text-red-500 font-bold">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Field = ({ label, name, value, onChange, placeholder, isTextArea }: any) => (
  <div className="space-y-3">
    <label className="text-[9px] uppercase text-white/40 tracking-widest block">{label}</label>
    {isTextArea ? (
      <textarea name={name} value={value} onChange={onChange} rows={3} className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none transition-colors" placeholder={placeholder} />
    ) : (
      <input name={name} value={value} onChange={onChange} className="w-full bg-white/5 border border-white/10 p-4 text-sm focus:border-accent outline-none transition-colors" placeholder={placeholder} />
    )}
  </div>
);

export default Admin;

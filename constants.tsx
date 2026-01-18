
import { Route, Course, Experience } from './types';

const INITIAL_ROUTES: Route[] = [
  {
    id: 'the-pillar',
    title: 'The Pillar',
    subtitle: 'Pilastro Dlait, Monte Sorasass',
    difficulty: '7c (7a+ obb.)',
    length: '120m',
    aspect: 'SE',
    date: '29/09/2024',
    tags: ['Sport Climbing', 'Technical', 'High Exposure'],
    mainImage: 'https://raw.githubusercontent.com/tomthias/gfaletti-website/tomthias-patch-1/assets/the-pillar/135620-main-image.jpg',
    sketchImage: 'https://raw.githubusercontent.com/tomthias/gfaletti-website/tomthias-patch-1/assets/the-pillar/135625.jpg',
    gallery: [
      'https://raw.githubusercontent.com/tomthias/gfaletti-website/tomthias-patch-1/assets/the-pillar/135619.jpg',
      'https://raw.githubusercontent.com/tomthias/gfaletti-website/tomthias-patch-1/assets/the-pillar/135621.jpg',
      'https://raw.githubusercontent.com/tomthias/gfaletti-website/tomthias-patch-1/assets/the-pillar/135622.jpg',
      'https://raw.githubusercontent.com/tomthias/gfaletti-website/tomthias-patch-1/assets/the-pillar/135623.jpg'
    ],
    lead: 'Una sequenza di tiri uno più bello dell\'altro! La storia di questo pilastro è un\'esplorazione semplice e diretta sulle pareti del Sorasass.',
    story: 'L\'accesso a queste pareti avviene normalmente dall\'alto, dal Monte Terlago. Inizialmente l\'avevamo escluso perché l\'avvicinamento sembrava troppo lungo, ma il desiderio di guardare più da vicino non è mai svanito. La roccia è risultata eccezionale fin dai primi tiri! Ne sono usciti quattro tiri: tecnici, fisici e di aderenza.',
    approach: 'Accesso da Monte Terlago. Scendere con cautela per raggiungere la base del pilastro attraverso i caratteristici prati.',
    descent: 'Discesa in doppia da soste attrezzate. Sono necessarie diverse calate.',
    gear: ['Rinvii', 'Corda da 60m', 'Attrezzatura sportiva'],
    climbers: ['Giordano Faletti', 'Martin Giovanazzi', 'Elio Mazzalai']
  },
  {
    id: 'happy-ending',
    title: 'Happy Ending',
    subtitle: 'Val Trementina, Paganella',
    difficulty: 'WI5+',
    length: '130m',
    aspect: 'E',
    date: 'Dic 2016',
    tags: ['Ice Climbing', 'Vertical', 'Winter'],
    mainImage: 'https://raw.githubusercontent.com/tomthias/gfaletti-website/tomthias-patch-1/assets/happy-ending/happy-endings-img.jpg',
    sketchImage: 'https://raw.githubusercontent.com/tomthias/gfaletti-website/f7aaa20c7d43d83e95d636d36ac61ae431a237f2/assets/happy-ending/happy-endings-routes.jpg',
    gallery: [
      'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?auto=format&fit=crop&q=80&w=800'
    ],
    lead: 'Un\'evidente linea di ghiaccio sulla parete est della Val Trementina.',
    story: 'Happy Ending condivide il primo tiro con Nido d\'Aquila. Tre spit sono stati posizionati sul secondo tiro a causa delle condizioni variabili del ghiaccio. Il tiro finale è puro ghiaccio verticale.',
    approach: 'Da Santel, Fai della Paganella. Seguire il sentiero 602.',
    descent: 'Salire attraverso i mughi per ritrovera il sentiero verso Malga di Fai.',
    gear: ['Cams 0.75-3', 'Viti da ghiaccio', 'Mezze corde'],
    climbers: ['Giordano Faletti', 'Luca Caldini', 'Alessio Miori']
  }
];

export const getRoutes = (): Route[] => {
  const stored = localStorage.getItem('gfaletti_custom_routes');
  const customRoutes = stored ? JSON.parse(stored) : [];
  return [...INITIAL_ROUTES, ...customRoutes];
};

export const ROUTES_DATA = getRoutes();

export const COURSES_DATA: Course[] = [
  { id: '1', title: 'Nivologia', description: 'Scienza della neve e consapevolezza delle valanghe per alpinisti indipendenti.', icon: 'Snowflake' },
  { id: '2', title: 'Sicurezza ARTVA', description: 'Padronanza dell\'attrezzatura di soccorso e tecniche di ricerca per freerider.', icon: 'Radio' },
  { id: '3', title: 'Mix Alpino', description: 'Tecniche avanzate per terreno roccioso, ghiacciato e misto.', icon: 'Mountain' }
];

export const EXPERIENCES_DATA: Experience[] = [
  { year: 2024, title: 'The Pillar First Ascent', description: 'Aperta una nuova linea di 7c sul Sorasass.' },
  { year: 2016, title: 'Happy Ending', description: 'Aperta una via di ghiaccio di riferimento WI5+.' },
  { year: 1996, title: 'Certificazione UIAGM', description: 'Ottenimento della qualifica internazionale di Guida Alpina.' }
];

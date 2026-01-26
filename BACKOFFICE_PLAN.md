# Piano Backoffice Routes - Guida Alpina

## Analisi Situazione Attuale

### Problemi Identificati
1. **LocalStorage** = dati persi se cambia browser/dispositivo
2. **No upload immagini** - solo URL manuali (impossibile per utente non tecnico)
3. **Admin non mobile-friendly** - la guida usa principalmente il telefono
4. **Nessuna autenticazione** - admin pubblicamente accessibile
5. **Nessuna sincronizzazione** - non può lavorare da più dispositivi

### User Persona: Giordano (Guida Alpina)
- **Device primario**: Smartphone (in montagna, in rifugio, a casa)
- **Livello tech**: Basso - deve essere intuitivo come WhatsApp
- **Contesto uso**: Spesso con connessione limitata, mani fredde/guanti
- **Bisogni**: Documentare vie appena scalate, aggiungere foto scattate, scrivere relazioni

---

## Soluzione: Supabase Free Tier

### Perché Supabase?
| Feature | Beneficio |
|---------|-----------|
| **Database PostgreSQL** | Dati persistenti, sync multi-device |
| **Auth Magic Link** | Login senza password (solo email) |
| **Storage** | Upload immagini diretto da telefono |
| **Free Tier Generoso** | 500MB database, 1GB storage, 50k auth users |
| **SDK JavaScript** | Integrazione facile con React |

### Limiti Free Tier (più che sufficienti)
- 500 MB database
- 1 GB file storage
- 2 GB bandwidth/mese
- 50,000 monthly active users
- Nessun limite di progetti

---

## Schema Database Supabase

### Tabella: `routes`
```sql
CREATE TABLE routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,

  -- Info Base
  title TEXT NOT NULL,
  subtitle TEXT, -- località/parete
  date_climbed DATE,

  -- Dati Tecnici
  difficulty TEXT,
  length TEXT, -- es. "120m"
  aspect TEXT, -- N, NE, E, SE, S, SW, W, NW
  tags TEXT[] DEFAULT '{}',

  -- Immagini (URLs da Storage)
  main_image_url TEXT,
  sketch_image_url TEXT,

  -- Contenuti Narrativi
  lead TEXT, -- hook breve
  story TEXT, -- storia completa
  approach TEXT, -- avvicinamento
  descent TEXT, -- discesa

  -- Metadata
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Trigger per updated_at
CREATE TRIGGER update_routes_updated_at
  BEFORE UPDATE ON routes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Tabella: `route_gallery`
```sql
CREATE TABLE route_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_gallery_route ON route_gallery(route_id);
```

### Tabella: `route_gear`
```sql
CREATE TABLE route_gear (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  item TEXT NOT NULL,
  sort_order INT DEFAULT 0
);
```

### Tabella: `route_climbers`
```sql
CREATE TABLE route_climbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sort_order INT DEFAULT 0
);
```

### Storage Bucket
```
Bucket: route-images
├── {route_id}/
│   ├── main.jpg
│   ├── sketch.jpg
│   └── gallery/
│       ├── 1.jpg
│       ├── 2.jpg
│       └── ...
```

### Row Level Security (RLS)
```sql
-- Solo utenti autenticati possono inserire/modificare
ALTER TABLE routes ENABLE ROW LEVEL SECURITY;

-- Lettura pubblica per routes pubblicate
CREATE POLICY "Public can view published routes"
  ON routes FOR SELECT
  USING (status = 'published');

-- Autenticati possono vedere tutte le proprie
CREATE POLICY "Authenticated can view own routes"
  ON routes FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Autenticati possono creare
CREATE POLICY "Authenticated can create routes"
  ON routes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Autenticati possono modificare le proprie
CREATE POLICY "Authenticated can update own routes"
  ON routes FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());
```

---

## UI/UX Design Mobile-First

### Principi Guida
1. **Touch-first**: Target minimi 48x48px
2. **One-hand operation**: Azioni importanti raggiungibili col pollice
3. **Progressive disclosure**: Non sovraccaricare, mostrare poco alla volta
4. **Auto-save**: Salvare ogni modifica automaticamente
5. **Offline-ready**: Funzionare anche senza rete (coda offline)
6. **Visual feedback**: Sempre chiaro cosa sta succedendo

### Struttura Backoffice

```
/admin                    → Dashboard (lista routes)
/admin/login              → Login con Magic Link
/admin/routes/new         → Wizard creazione nuova route
/admin/routes/:id/edit    → Modifica route esistente
/admin/routes/:id/preview → Anteprima prima di pubblicare
```

### Wizard Creazione Route (10 Steps)

#### Step 1: Info Base (Obbligatorio)
```
┌─────────────────────────────────┐
│ ← Nuova Via                     │
├─────────────────────────────────┤
│                                 │
│  Nome della Via *               │
│  ┌─────────────────────────┐    │
│  │ The Pillar              │    │
│  └─────────────────────────┘    │
│                                 │
│  Località / Parete              │
│  ┌─────────────────────────┐    │
│  │ Pilastro Dlait, Monte.. │    │
│  └─────────────────────────┘    │
│                                 │
│  Data della Salita              │
│  ┌─────────────────────────┐    │
│  │ 📅 29/09/2024           │    │
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│ [        Avanti →        ]      │
│ ○ ○ ○ ○ ○ ○ ○ ○ ○ ○            │
└─────────────────────────────────┘
```

#### Step 2: Dati Tecnici
```
┌─────────────────────────────────┐
│ ← Dati Tecnici            2/10  │
├─────────────────────────────────┤
│                                 │
│  Difficoltà                     │
│  ┌─────────────────────────┐    │
│  │ 7c (7a+ obb.)           │    │
│  └─────────────────────────┘    │
│  Suggerimenti:                  │
│  [6a] [6b] [7a] [7b] [WI4] [M5] │
│                                 │
│  Sviluppo                       │
│  ┌─────────────────────────┐    │
│  │ 120m                    │    │
│  └─────────────────────────┘    │
│                                 │
│  Esposizione                    │
│  ┌─N──NE──E──SE──S──SW──W──NW─┐ │
│  │      [  SE  ]              │ │
│  └────────────────────────────┘ │
│                                 │
│  Tipo di Scalata                │
│  [✓ Sport] [  Ice  ] [ Mixed ] │
│  [ Trad ] [ Alpine ] [ Multi ] │
│                                 │
├─────────────────────────────────┤
│ [← Indietro]    [Avanti →]      │
└─────────────────────────────────┘
```

#### Step 3: Foto Principale (Hero)
```
┌─────────────────────────────────┐
│ ← Foto Principale         3/10  │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │      📷                 │    │
│  │                         │    │
│  │   Tocca per caricare    │    │
│  │   o trascina qui        │    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                 │
│  [ 📸 Scatta Foto ]             │
│  [ 🖼️ Scegli da Galleria ]       │
│                                 │
│  ℹ️ Questa sarà l'immagine      │
│     principale della via        │
│                                 │
├─────────────────────────────────┤
│ [← Indietro]    [Avanti →]      │
└─────────────────────────────────┘
```

#### Step 4: Galleria Foto
```
┌─────────────────────────────────┐
│ ← Galleria                4/10  │
├─────────────────────────────────┤
│                                 │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ 📷1 │ │ 📷2 │ │ + │         │
│  │     │ │     │ │   │         │
│  └──✕──┘ └──✕──┘ └─────┘       │
│                                 │
│  Tieni premuto per riordinare   │
│  Tocca ✕ per rimuovere          │
│                                 │
│  [ + Aggiungi Foto ]            │
│                                 │
│  Caption foto 1:                │
│  ┌─────────────────────────┐    │
│  │ Vista dal basso...      │    │
│  └─────────────────────────┘    │
│                                 │
├─────────────────────────────────┤
│ [← Indietro]    [Avanti →]      │
└─────────────────────────────────┘
```

#### Step 5: Schizzo Tecnico (Topo)
```
┌─────────────────────────────────┐
│ ← Schizzo Tecnico         5/10  │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │                         │    │
│  │   📐 Carica Topo        │    │
│  │                         │    │
│  └─────────────────────────┘    │
│                                 │
│  [ 📷 Scatta Foto Schizzo ]     │
│  [ 🖼️ Carica da Galleria ]       │
│                                 │
│  ℹ️ Puoi caricare:              │
│  - Foto di schizzo su carta     │
│  - Immagine SVG/PNG del topo    │
│  - Screenshot da altre fonti    │
│                                 │
│  [ Salta questo passaggio ]     │
│                                 │
├─────────────────────────────────┤
│ [← Indietro]    [Avanti →]      │
└─────────────────────────────────┘
```

#### Step 6: La Storia
```
┌─────────────────────────────────┐
│ ← La Storia               6/10  │
├─────────────────────────────────┤
│                                 │
│  Introduzione (2-3 righe)       │
│  ┌─────────────────────────┐    │
│  │ Una linea nuova su una  │    │
│  │ delle pareti più belle..│    │
│  └─────────────────────────┘    │
│  [🎤 Dettatura] [✨ Genera AI]  │
│                                 │
│  Racconto Completo              │
│  ┌─────────────────────────┐    │
│  │ La via nasce dall'idea  │    │
│  │ di esplorare...         │    │
│  │                         │    │
│  │                         │    │
│  │                         │    │
│  └─────────────────────────┘    │
│  [🎤 Dettatura] [✨ Genera AI]  │
│                                 │
│  💡 Scrivi come racconteresti   │
│     la via a un amico           │
│                                 │
├─────────────────────────────────┤
│ [← Indietro]    [Avanti →]      │
└─────────────────────────────────┘
```

#### Step 7: Info Pratiche
```
┌─────────────────────────────────┐
│ ← Info Pratiche           7/10  │
├─────────────────────────────────┤
│                                 │
│  Come Arrivare (Avvicinamento)  │
│  ┌─────────────────────────┐    │
│  │ Da Trento prendere...   │    │
│  │                         │    │
│  └─────────────────────────┘    │
│  [🎤 Dettatura]                 │
│                                 │
│  Discesa                        │
│  ┌─────────────────────────┐    │
│  │ Dalla cima seguire il   │    │
│  │ sentiero verso nord...  │    │
│  └─────────────────────────┘    │
│  [🎤 Dettatura]                 │
│                                 │
│  💡 Includi punti di            │
│     riferimento e tempi         │
│                                 │
├─────────────────────────────────┤
│ [← Indietro]    [Avanti →]      │
└─────────────────────────────────┘
```

#### Step 8: Attrezzatura
```
┌─────────────────────────────────┐
│ ← Attrezzatura            8/10  │
├─────────────────────────────────┤
│                                 │
│  Attrezzatura Consigliata       │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Corda 70m               │ ✕  │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 12 rinvii              │ ✕  │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ + Aggiungi...           │    │
│  └─────────────────────────┘    │
│                                 │
│  Suggerimenti rapidi:           │
│  [Corda 60m] [Corda 70m]        │
│  [Friends] [Nuts] [Casco]       │
│  [Piccozze] [Ramponi]           │
│                                 │
├─────────────────────────────────┤
│ [← Indietro]    [Avanti →]      │
└─────────────────────────────────┘
```

#### Step 9: Team
```
┌─────────────────────────────────┐
│ ← Team                    9/10  │
├─────────────────────────────────┤
│                                 │
│  Chi ha scalato la via?         │
│                                 │
│  ┌─────────────────────────┐    │
│  │ Giordano Faletti        │ ✕  │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Martin Giovanazzi       │ ✕  │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ + Aggiungi scalatore    │    │
│  └─────────────────────────┘    │
│                                 │
│  💡 Aggiungi tutti i membri     │
│     della cordata               │
│                                 │
├─────────────────────────────────┤
│ [← Indietro]    [Avanti →]      │
└─────────────────────────────────┘
```

#### Step 10: Revisione & Pubblica
```
┌─────────────────────────────────┐
│ ← Revisione              10/10  │
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────┐    │
│  │  [Hero Image Preview]   │    │
│  │       THE PILLAR        │    │
│  │  Pilastro Dlait, Monte  │    │
│  └─────────────────────────┘    │
│                                 │
│  ✓ Info Base                    │
│  ✓ Dati Tecnici: 7c, 120m, SE   │
│  ✓ Foto Principale              │
│  ✓ 4 foto in galleria           │
│  ✓ Schizzo tecnico              │
│  ✓ Storia completa              │
│  ✓ Avvicinamento e discesa      │
│  ✓ 5 item attrezzatura          │
│  ✓ 3 scalatori nel team         │
│                                 │
│  [👁️ Anteprima Completa]        │
│                                 │
├─────────────────────────────────┤
│ [💾 Salva Bozza]                │
│ [🚀 PUBBLICA]                   │
└─────────────────────────────────┘
```

---

## Componenti UI da Sviluppare

### 1. Layout Components
```
components/admin/
├── AdminLayout.tsx         # Layout con navbar bottom
├── WizardLayout.tsx        # Layout per wizard steps
├── StepIndicator.tsx       # Pallini progress (● ○ ○ ○)
└── BottomNav.tsx           # Navigazione fissa in basso
```

### 2. Form Components
```
components/admin/forms/
├── TextInput.tsx           # Input testo grande touch
├── TextArea.tsx            # Textarea con auto-resize
├── DatePicker.tsx          # Selettore data mobile-friendly
├── TagSelector.tsx         # Multi-select con chip
├── AspectPicker.tsx        # Selettore direzione (N, NE, etc)
├── ImageUploader.tsx       # Upload con preview e crop
├── GalleryManager.tsx      # Gestione multipla immagini
├── ListManager.tsx         # Lista dinamica (gear, climbers)
├── VoiceInput.tsx          # Dettatura vocale
└── AIGenerateButton.tsx    # Bottone genera con Gemini
```

### 3. Display Components
```
components/admin/
├── RouteCard.tsx           # Card route nella dashboard
├── RoutePreview.tsx        # Anteprima completa
├── ImagePreview.tsx        # Preview immagine con zoom
└── StatusBadge.tsx         # Badge draft/published
```

### 4. Auth Components
```
components/admin/auth/
├── LoginForm.tsx           # Form magic link
├── AuthGuard.tsx           # Wrapper protezione route
└── LogoutButton.tsx        # Bottone logout
```

---

## Input Fields Completi

### Campi Route (tutti i campi previsti)

| Campo | Tipo | Obbligatorio | Note |
|-------|------|--------------|------|
| `title` | text | ✓ | Nome della via |
| `subtitle` | text | - | Località/Parete |
| `date_climbed` | date | - | Data scalata |
| `difficulty` | text | - | Grado (es. 7c, WI5+) |
| `length` | text | - | Sviluppo (es. 120m) |
| `aspect` | select | - | Esposizione (N, NE, E...) |
| `tags` | multi-select | - | Tipo scalata |
| `main_image` | file | - | Foto hero |
| `gallery` | files[] | - | Foto galleria |
| `sketch_image` | file | - | Topo/Schizzo |
| `lead` | textarea | - | Intro breve (2-3 righe) |
| `story` | textarea | - | Racconto completo |
| `approach` | textarea | - | Avvicinamento |
| `descent` | textarea | - | Discesa |
| `gear` | list | - | Lista attrezzatura |
| `climbers` | list | - | Lista scalatori |
| `status` | radio | ✓ | draft/published |

### Tag Predefiniti
```typescript
const ROUTE_TAGS = [
  'Sport Climbing',
  'Trad Climbing',
  'Ice Climbing',
  'Mixed',
  'Alpine',
  'Multi-pitch',
  'Bouldering',
  'High Exposure',
  'Technical',
  'Vertical',
  'Overhang',
  'Slab',
  'Crack',
  'Winter'
];
```

### Suggerimenti Attrezzatura
```typescript
const GEAR_SUGGESTIONS = [
  'Corda 60m',
  'Corda 70m',
  'Corda doppia 2x60m',
  '10 rinvii',
  '12 rinvii',
  '15 rinvii',
  'Set friends',
  'Set nuts',
  'Casco',
  'Piccozze tecniche',
  'Ramponi',
  'Viti da ghiaccio',
  'Cordini',
  'Fettucce'
];
```

---

## Flusso Autenticazione

### Magic Link (Consigliato per utente non tecnico)
```
1. Utente va su /admin
2. Se non autenticato → redirect /admin/login
3. Inserisce email
4. Riceve email con link magico
5. Click link → autenticato automaticamente
6. Redirect a /admin/dashboard
```

### Implementazione Supabase Auth
```typescript
// Login
const { error } = await supabase.auth.signInWithOtp({
  email: 'guida@example.com',
  options: {
    emailRedirectTo: 'https://sito.com/admin'
  }
});

// Check session
const { data: { session } } = await supabase.auth.getSession();

// Logout
await supabase.auth.signOut();
```

---

## Integrazione Supabase

### Setup Client
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### Hooks React (esempi)
```typescript
// hooks/useRoutes.ts
export function useRoutes() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRoutes() {
      const { data, error } = await supabase
        .from('routes')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setRoutes(data);
      setLoading(false);
    }
    fetchRoutes();
  }, []);

  return { routes, loading };
}

// hooks/useImageUpload.ts
export function useImageUpload() {
  const uploadImage = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('route-images')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (data) {
      const { data: { publicUrl } } = supabase.storage
        .from('route-images')
        .getPublicUrl(path);
      return publicUrl;
    }
    throw error;
  };

  return { uploadImage };
}
```

---

## Roadmap Implementazione

### Fase 1: Setup Supabase (1-2 ore)
- [ ] Creare progetto Supabase
- [ ] Configurare tabelle database
- [ ] Configurare Storage bucket
- [ ] Configurare Auth
- [ ] Aggiungere variabili ambiente

### Fase 2: Auth & Routing (2-3 ore)
- [ ] Installare @supabase/supabase-js
- [ ] Creare client Supabase
- [ ] Implementare AuthGuard
- [ ] Creare pagina login
- [ ] Proteggere route admin

### Fase 3: Dashboard Admin (3-4 ore)
- [ ] Layout mobile-first
- [ ] Lista routes con card
- [ ] Filtri (draft/published)
- [ ] FAB per nuova route
- [ ] Delete con conferma

### Fase 4: Wizard Creazione (6-8 ore)
- [ ] Wizard layout con steps
- [ ] Step 1: Info Base
- [ ] Step 2: Dati Tecnici
- [ ] Step 3: Foto Principale
- [ ] Step 4: Galleria
- [ ] Step 5: Topo
- [ ] Step 6: Storia
- [ ] Step 7: Info Pratiche
- [ ] Step 8: Attrezzatura
- [ ] Step 9: Team
- [ ] Step 10: Revisione

### Fase 5: Upload Immagini (2-3 ore)
- [ ] ImageUploader component
- [ ] Compressione client-side
- [ ] Preview e crop
- [ ] Upload a Supabase Storage
- [ ] Progress indicator

### Fase 6: AI Integration (1-2 ore)
- [ ] Bottone genera con Gemini
- [ ] Prompt engineering per testi alpinismo
- [ ] Loading states

### Fase 7: Polishing (2-3 ore)
- [ ] Auto-save
- [ ] Offline queue (opzionale)
- [ ] Animazioni e transizioni
- [ ] Error handling
- [ ] Test su mobile reale

---

## Variabili Ambiente Necessarie

```env
# .env.local
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJI...
VITE_GEMINI_API_KEY=AIza... (già esistente)
```

---

## Note Tecniche

### Compressione Immagini Client-Side
```typescript
// Prima di upload, comprimere per risparmiare storage
import imageCompression from 'browser-image-compression';

const compressImage = async (file: File) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };
  return await imageCompression(file, options);
};
```

### Auto-Save con Debounce
```typescript
// Salvare automaticamente ogni 3 secondi di inattività
const debouncedSave = useDebouncedCallback(
  async (data) => {
    await supabase
      .from('routes')
      .update(data)
      .eq('id', routeId);
  },
  3000
);
```

### Voice Input (Web Speech API)
```typescript
// Dettatura vocale per testi lunghi
const recognition = new webkitSpeechRecognition();
recognition.lang = 'it-IT';
recognition.continuous = true;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  setFieldValue(prev => prev + ' ' + transcript);
};
```

---

## Conclusione

Questo piano trasforma il sito da statico a dinamico con:
1. **Database persistente** su Supabase (gratis)
2. **Upload immagini** diretto da telefono
3. **Autenticazione** semplice via email
4. **UI mobile-first** ottimizzata per guide alpine
5. **Workflow wizard** step-by-step intuitivo
6. **AI assistance** per generare testi

Il tutto mantenendo l'hosting gratuito su GitHub Pages (solo il frontend) con Supabase come backend serverless.

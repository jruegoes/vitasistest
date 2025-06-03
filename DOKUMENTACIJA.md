# Vitasis - Popolna Dokumentacija

## 📋 Kazalo Vsebine
1. [Pregled Aplikacije](#pregled-aplikacije)
2. [Funkcionalnosti](#funkcionalnosti)
3. [Uporabljene Knjižnice](#uporabljene-knjižnice)
4. [Arhitektura in Struktura](#arhitektura-in-struktura)
5. [Komponente v Detajlu](#komponente-v-detajlu)
6. [Dostopnost (Accessibility)](#dostopnost)
7. [Optimizacije Učinkovitosti](#optimizacije-učinkovitosti)
8. [Stiliziranje](#stiliziranje)
9. [Testiranje](#testiranje)
10. [Nastavitve in Konfiguracija](#nastavitve-in-konfiguracija)

---

## 🎯 Pregled Aplikacije

**Vitasis** je napredna spletna aplikacija za **pretvorbo govora v besedilo (Speech-to-Text)** v realnem času. Aplikacija omogoča uporabnikom snemanje glasu in takojšnje pretvarjanje v besedilo z možnostjo urejanja v naprednem besedilnem urejevalniku.

### Ključne Lastnosti:
- **Realno-časno prepoznavanje govora** preko WebSocket povezave
- **Napredni besedilni urejevalnik** (Lexical)
- **Večjezična podpora** (angleščina, slovenščina)
- **Svetla/temna tema**
- **Popolna dostopnost** (WCAG 2.1 AA)
- **Avtomatska ločila in kapitalizacija**
- **Samodejno ustavljanje ob tišini** (5 sekund)
- **Optimizirana učinkovitost** (lazy loading, memoization)
- **Avtentifikacijski sistem** za varno uporabo
- **Prenos besedila** med komponentami

---

## 🚀 Funkcionalnosti

### 1. **Avtentifikacija**
- Varen prijavni sistem preko zunanje API
- Kontekstno upravljanje avtentifikacije
- Proxy konfiguracija za razvojno okolje
- Zaščitene komponente in funkcionalnosti

### 2. **Snemanje Govora**
- Izbira iz različnih ASR (Automatic Speech Recognition) modelov
- Realno-časno prikazovanje transkripcije
- Avtomatsko ustavljanje po 5 sekundah tišine
- Vizualni indikatorji stanja (inicializacija, snemanje, napaka)
- Login integracija za dostop do STT storitev

### 3. **Napredni Besedilni Urejevalnik**
- **Formatiranje besedila**: krepko, ležeče, podčrtano, prečrtano, koda
- **Kopiranje**: izbrano besedilo ali celotno vsebino
- **Brisanje**: popolno čiščenje vsebine
- **Samodejni ločila**: dodajanje pik po pavzah v govoru
- **Kapitalizacija**: prva črka po ločilih
- **Placeholder stanje**: Ko uporabnik ni prijavljen
- **Loading stanja**: Med nalaganjem komponente

### 4. **Prenos Besedila**
- Gumb za prenos transkripcije v urejevalnik v primeru nenadnega prenehanja transkribcije ali manualnega stopa.
- Takojšnje vstavljanje prepisanega besedila
- Integracija med recording in editor komponentami

### 5. **Uporabniški Vmesnik**
- **Tema**: svetla/temna z animiranimi prehodi
- **Jezik**: angleščina/slovenščina z dinamičnim preklapljanjem
- **Odzivni dizajn**: prilagaja se vsem velikostim zaslonov
- **Animacije**: gladki prehodi in vizualni učinki
- **Glass effect**: Moderni polprozorni design

---

## 📚 Uporabljene Knjižnice

### **Osnovna Struktura**
```json
{
  "react": "^19.1.0",           // UI framework
  "typescript": "~5.8.3",       // Tipno varnost
  "vite": "^6.3.5"              // Build orodje
}
```

### **UI in Stiliziranje**
```json
{
  "tailwindcss": "^4.1.8",      // Utility-first CSS
  "@tailwindcss/vite": "^4.1.8", // Vite plugin za Tailwind
  "@headlessui/react": "^2.2.4", // Dostopne UI komponente
  "lucide-react": "^0.511.0"    // Ikone
}
```

### **Besedilni Urejevalnik**
```json
{
  "lexical": "^0.31.2",         // Osnova urejevalnika
  "@lexical/react": "^0.31.2"   // React integracija
}
```

### **Internationalizacija**
```json
{
  "i18next": "^25.2.1",                    // I18n sistem
  "react-i18next": "^15.5.2",              // React integracija
  "i18next-browser-languagedetector": "^8.1.0" // Avtomatska zaznava jezika
}
```

### **HTTP Zahtevki**
```json
{
  "axios": "^1.9.0"             // HTTP klient za API klice
}
```

### **Testiranje**
```json
{
  "vitest": "^3.2.0",                    // Test runner
  "@testing-library/react": "^16.3.0",   // React testiranje
  "@testing-library/jest-dom": "^6.6.3", // DOM matchers
  "@testing-library/user-event": "^14.6.1", // Uporabniške interakcije
  "jsdom": "^26.1.0"                     // DOM environment za teste
}
```

---

## 🏗️ Arhitektura in Struktura

### **Splošna Arhitektura**
Aplikacija sledi **modularni arhitekturi** z jasno ločenimi odgovornostmi:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Prezentacija  │    │   Poslovna      │    │   Podatki       │
│   (Components)  │◄──►│   Logika        │◄──►│   (Services)    │
│                 │    │   (Hooks/Utils) │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Struktura Map**

```
vitasis/
├── public/                          # Statične datoteke
│   └── vite.svg                     # Vite ikona
├── src/
│   ├── api/                         # API konfiguracija
│   │   ├── auth.ts                  # Avtentifikacija
│   │   └── client.ts                # HTTP klient
│   │
│   ├── components/                  # UI komponente
│   │   ├── recording/               # Snemanje govora
│   │   │   ├── recording.tsx        # Glavna komponenta
│   │   │   ├── recording-button.tsx # Gumb za snemanje
│   │   │   ├── model-dropdown.tsx   # Izbira modelov
│   │   │   ├── login-form.tsx       # Prijavni obrazec
│   │   │   └── transfer-text-button.tsx # Prenos besedila
│   │   │
│   │   ├── texteditor/              # Besedilni urejevalnik
│   │   │   ├── lexical.tsx          # Glavna komponenta
│   │   │   ├── index.ts             # Export točka
│   │   │   ├── config/              # Konfiguracija
│   │   │   │   ├── editor-config.ts
│   │   │   │   └── editor-theme.ts
│   │   │   ├── plugins/             # Funkcionalnosti
│   │   │   │   └── text-insert-plugin.tsx
│   │   │   └── toolbar/             # Orodna vrstica
│   │   │       ├── toolbar-plugin.tsx
│   │   │       ├── toolbar-button.tsx
│   │   │       └── toolbar-actions.ts
│   │   │
│   │   ├── editor/                  # Editor helper komponente
│   │   │   ├── index.ts             # Export točka
│   │   │   ├── editor-loading.tsx   # Loading stanje
│   │   │   └── editor-placeholder.tsx # Placeholder za neprijavljene
│   │   │
│   │   └── toggles/                 # Preklopni gumbi
│   │       ├── theme-toggle.tsx     # Tema
│   │       └── language-toggle.tsx  # Jezik
│   │
│   ├── config/                      # Aplikacijska konfiguracija
│   │   └── api.ts                   # API nastavitve
│   │
│   ├── contexts/                    # React konteksti
│   │   ├── theme-context.tsx        # Upravljanje teme
│   │   └── auth-context.tsx         # Avtentifikacija
│   │
│   ├── hooks/                       # Prilagojeni hooki
│   │   └── useSTTStream.ts          # STT glavna logika
│   │
│   ├── i18n/                        # Večjezičnost
│   │   ├── config.ts                # I18n konfiguracija
│   │   └── locales/                 # Prevodi
│   │       ├── en.json              # Angleščina
│   │       └── sl.json              # Slovenščina
│   │
│   ├── services/                    # Poslovne storitve
│   │   ├── audio-processing-service.ts  # Procesiranje zvoka
│   │   ├── stt-api-service.ts           # STT API
│   │   └── websocket-service.ts         # WebSocket povezave
│   │
│   ├── styles/                      # Stiliziranje
│   │   ├── accessibility.css        # Dostopnost
│   │   ├── recording-animations.css # Animacije
│   │   └── model-dropdown-styles.ts # Dropdown stili
│   │
│   ├── tests/                       # Testi
│   │   ├── integration/             # Integracijski
│   │   ├── unit/                    # Enotni
│   │   └── setup.ts                 # Test nastavitve
│   │
│   ├── types/                       # TypeScript tipi
│   │   ├── auth.ts                  # Avtentifikacija
│   │   └── stt.ts                   # Speech-to-Text
│   │
│   ├── utils/                       # Pomožne funkcije
│   │   ├── recording-status.ts      # Status logika
│   │   ├── stt-message-handlers.ts  # WebSocket sporočila
│   │   └── text-formatting.ts       # Formatiranje besedila
│   │
│   ├── workers/                     # Web Workers
│   │   └── audio-worker.js          # Procesiranje zvoka
│   │
│   ├── App.tsx                      # Glavna aplikacija
│   ├── main.tsx                     # Vstopna točka
│   ├── index.css                    # Globalni stili
│   └── vite-env.d.ts               # Vite tipi
│
├── package.json                     # Odvisnosti projekta
├── vite.config.ts                   # Vite konfiguracija
├── tsconfig.json                    # TypeScript base config
├── tsconfig.app.json                # TypeScript app config
├── tsconfig.node.json               # TypeScript node config
├── eslint.config.js                 # ESLint konfiguracija
├── index.html                       # HTML template
├── README.md                        # Projekt opis
└── DOKUMENTACIJA.md                 # Ta dokumentacija
```

### **Razlogi za Strukturo**

#### **Ločevanje po Funkcionalnostih**
- **`/components`**: UI komponente grupirane po funkcionalnosti (recording, texteditor, editor, toggles)
- **`/contexts`**: React konteksti za globalno stanje (tema, avtentifikacija)
- **`/config`**: Centralizirane aplikacijske nastavitve
- **`/services`**: Izolacija poslovne logike od UI komponent
- **`/hooks`**: Združevanje povezane state logike v ponovno uporabne hooke

#### **Modularnost**
- **`/texteditor`**: Ločena mapa za Lexical urejevalnik omogoča neodvisno razvijanje
- **`/editor`**: Helper komponente za editor (loading, placeholder)
- **`/config`**, **`/plugins`**, **`/toolbar`**: Jasna ločitev odgovornosti

#### **Skalabilnost**
- **`/types`**: Centralizirani TypeScript tipi
- **`/utils`**: Ponovno uporabne funkcije
- **`/i18n`**: Ločena struktura za večjezičnost

---

## 🧩 Komponente v Detajlu

### **1. Glavni Aplikacijski Tok (`App.tsx`)**

```typescript
export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

**Ključne funkcije:**
- **Contextual Providers**: Tema in avtentifikacija wraparji
- **Lazy Loading**: Urejevalnik se lazy loada - saj ni instantno potreben.
- **Conditional Rendering**: Različne komponente glede na avtentifikacijo
- **Skip Links**: Dostopnost za keyboard navigacijo

### **2. Avtentifikacijski Sistem**
- Varni obrazec za prijavo
- Error handling z uporabniškimi sporočili
- Integracija z auth kontekstom
- Dostopni form elementi


**Ključne značilnosti:**
- **Proxy konfiguracija**: Preusmerja auth klice na zunanji API (zaradi CORS potrebe pri developmentu)
- **Tailwind Vite plugin**: Neposredna integracija Tailwind CSS
- **Test konfiguracija**: Vitest setup z jsdom okoljem (tudi Jest za renderiranje React komponent)

**Kako testirati**

```bash
# Razvojna različica z proxy
npm run dev

# Produkcijska gradnja z TypeScript preverjanjem
npm run build

# Preview produkcijske gradnje
npm run preview

# Linting
npm run lint

# Testiranje z Vitest
npm run test
```

Testirati samo na Chromium based browserju, ker ni resamplinga

iz dokumentacije

let audioContext;
const targetSampleRate = 16000;

if (navigator.userAgent.includes("Chrome") || navigator.userAgent.includes("Microsoft Edge")) {
  audioContext = new AudioContext({ sampleRate: targetSampleRate });
} else {
  audioContext = new AudioContext(); // Will default to device rate (often 44.1kHz or 48kHz)
}
⚠️ If the AudioContext sample rate does not match the target, we must resample the audio before sending it to the Truebar service.
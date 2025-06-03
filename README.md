## ✅ Kako testirati aplikacijo

```bash
# Razvojna različica z vklopljenim proxyjem
npm run dev

# Produkcijska gradnja z vključeno TypeScript validacijo
npm run build

# Predogled produkcijske različice
npm run preview

# Preverjanje kode z ESLint
npm run lint

# Testiranje z Vitest (vključuje enote in integracije)
npm run test
🔐 Uporabiti Playground credentials.

📄 Več informacij najdete v datoteki DOKUMENTACIJA.md.

🧪 Testirano izključno na RIVA:SI-GEN modelih.
⚠️ KALDI včasih deluje, včasih ne

💡 Lastnosti aplikacije
Avtentikacija in tematski context (teme)

Podpora za več jezikov

Enostavni unit in integration testi

Modularna struktura

Minimalna optimizacija (npr. lazy loading editorja, memoizacija)

Uporablja sodobne CSS rešitve

Dostopnost (accessibility):

Podpora za uporabo s tipkovnico

aria-id za screen readerje in QA testiranje

🤖 Razvojni proces
Razvito s pomočjo AI orodij:

Claude 4: načrtovanje, testiranje, dokumentacija, komentarji

Gemini 2.5 Pro: generiranje komponent

Cursor: kot glavno razvojno okolje

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

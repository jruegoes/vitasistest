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

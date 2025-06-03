import { RecordingTab } from './components/recording/recording';
import { ThemeProvider } from './contexts/theme-context';
import { AuthProvider, useAuth } from './contexts/auth-context';
import { ThemeToggle } from './components/toggles/theme-toggle';
import { LanguageToggle } from './components/toggles/language-toggle';
import { EditorLoading, EditorPlaceholder } from './components/editor';
import { CLIENT_CONFIG } from './config/api';
import { useRef, useCallback, Suspense, lazy } from "react";
import { useTranslation } from 'react-i18next';
import './i18n/config';

// Lazy load the Editor component
const Editor = lazy(() => import('./components/texteditor').then(module => ({ default: module.Editor })));

function AppContent() {
  const editorRef = useRef<(text: string) => void>(() => {});
  const addPunctuationRef = useRef<() => void>(() => {});
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  // Speech pause detection - add punctuation after configured delay
  const handleTranscript = useCallback((text: string) => {
    // Only process transcripts if authenticated
    if (!isAuthenticated) return;
    
    // Clear any existing pause timer
    if (pauseTimerRef.current) {
      clearTimeout(pauseTimerRef.current);
    }

    // Insert the transcribed text
    editorRef.current?.(text);

    // Set a new timer to add punctuation after a pause
    pauseTimerRef.current = setTimeout(() => {
      console.log("Speech pause detected, adding punctuation");
      addPunctuationRef.current?.();
    }, CLIENT_CONFIG.AUTO_PUNCTUATION_DELAY);
  }, [isAuthenticated]);

  // Memoize the editor callback to prevent unnecessary re-renders
  const handleInsertText = useCallback((insertFn: (text: string) => void, addPunctuation: () => void) => {
    editorRef.current = insertFn;
    addPunctuationRef.current = addPunctuation;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500 relative overflow-hidden">
      {/* Skip Links for keyboard navigation */}
      <div className="sr-only">
        <a 
          href="#main-content" 
          className="absolute top-0 left-0 bg-blue-600 text-white p-2 z-50 transform -translate-y-full focus:translate-y-0 transition-transform"
        >
          {t('accessibility.skipToMain', 'Skip to main content')}
        </a>
        <a 
          href="#controls" 
          className="absolute top-0 left-0 bg-blue-600 text-white p-2 z-50 transform -translate-y-full focus:translate-y-0 transition-transform"
        >
          {t('accessibility.skipToControls', 'Skip to controls')}
        </a>
      </div>

      {/* Decorative background circles - marked as decorative for screen readers */}
      <div 
        className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 dark:from-blue-600/30 dark:to-cyan-600/30 rounded-full blur-3xl"
        aria-hidden="true"
        role="presentation"
      ></div>
      <div 
        className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-400/20 dark:from-indigo-600/30 dark:to-purple-600/30 rounded-full blur-3xl"
        aria-hidden="true"
        role="presentation"
      ></div>
      
      {/* Navigation/Controls area */}
      <nav 
        className="fixed top-6 right-6 z-50 flex gap-3" 
        id="controls"
        role="navigation"
        aria-label={t('accessibility.applicationControls', 'Application controls')}
      >
        <ThemeToggle />
        <LanguageToggle />
      </nav>
      
      {/* Main content area */}
      <main 
        id="main-content" 
        className="container mx-auto px-4 py-8 max-w-4xl relative z-10"
        role="main"
      >
        {/* Recording Section */}
        <section className="mb-8 relative" aria-labelledby="recording-section-title">
          {/* Background circle for recording section - decorative */}
          <div 
            className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 dark:from-blue-400/20 dark:to-cyan-400/20 rounded-full blur-2xl"
            aria-hidden="true"
            role="presentation"
          ></div>
          <div className="glass-effect bg-white/70 dark:bg-gray-900/70 rounded-3xl p-8 shadow-2xl border border-gray-300/80 dark:border-white/20 shadow-gray-200/20 dark:shadow-white/10 relative z-10">
            <RecordingTab onTranscript={handleTranscript} />
          </div>
        </section>

        {/* Editor Section */}
        <section className="space-y-4 relative" aria-labelledby="editor-section-title">
          {/* Background circle for editor section - decorative */}
          <div 
            className="absolute -bottom-20 -right-20 w-64 h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-indigo-400/20 dark:to-purple-400/20 rounded-full blur-2xl"
            aria-hidden="true"
            role="presentation"
          ></div>
          <header className="text-center relative z-10">
            <h2 
              id="editor-section-title"
              className="text-2xl font-bold font-montserrat text-gray-900 dark:text-gray-100 mb-2"
            >
              {t('app.textEditorTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-dm-sans">
              {t('app.textEditorDescription')}
            </p>
          </header>
          
          <div className="glass-effect bg-white/70 dark:bg-gray-900/70 rounded-3xl p-6 shadow-2xl border border-gray-300/80 dark:border-white/20 shadow-gray-200/20 dark:shadow-white/10 relative z-10">
            {/* Conditional rendering based on authentication */}
            {isAuthenticated ? (
              <Suspense fallback={<EditorLoading />}>
                <Editor onInsertText={handleInsertText} />
              </Suspense>
            ) : (
              <EditorPlaceholder />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

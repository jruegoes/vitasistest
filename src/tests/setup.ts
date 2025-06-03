import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Enhanced i18next mock for integration testing
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'accessibility.toggleButton': 'Toggle theme button',
        'theme.switchToLight': 'Switch to light mode',
        'theme.switchToDark': 'Switch to dark mode',
        'language.english': 'English',
        'language.slovenian': 'Slovenščina',
        'language.switchLanguage': 'Switch language',
        'accessibility.currentlySelected': 'Currently selected',
        'accessibility.applicationControls': 'Application controls',
        'accessibility.skipToMain': 'Skip to main content',
        'accessibility.skipToControls': 'Skip to controls',
        'app.textEditorTitle': 'Text Editor',
        'app.textEditorDescription': 'Your transcribed text will appear here for editing',
      }
      return translations[key] || key
    },
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    }
  }),
  // Add missing exports for i18n configuration
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}))

// Mock i18next browser language detector
vi.mock('i18next-browser-languagedetector', () => ({
  default: vi.fn(),
}))

// Mock i18next core
vi.mock('i18next', () => ({
  default: {
    use: vi.fn().mockReturnThis(),
    init: vi.fn().mockReturnThis(),
  },
}))

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
}) 
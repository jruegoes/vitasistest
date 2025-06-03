import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import App from '../../App'

// Mock that can track language state
let currentLanguage = 'en'
const mockChangeLanguage = vi.fn((lang: string) => {
  currentLanguage = lang
})

// Enhanced mock for react-i18next that tracks language changes
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
      get language() { return currentLanguage },
      changeLanguage: mockChangeLanguage,
    }
  }),
  initReactI18next: {
    type: '3rdParty',
    init: vi.fn(),
  },
}))

describe('Navigation Controls Integration', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Reset language state
    currentLanguage = 'en'
    mockChangeLanguage.mockClear()
    
    // Reset localStorage and system preferences
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false,
      media: '(prefers-color-scheme: dark)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    } as MediaQueryList)
  })

  it('should render both navigation controls together', () => {
    render(<App />)
    
    // Check that navigation area exists
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveAttribute('aria-label', 'Application controls')
    
    // Check that both toggle buttons are present
    const toggleButtons = screen.getAllByRole('switch')
    expect(toggleButtons).toHaveLength(2)
    
    // Check specific controls
    const themeToggle = screen.getByLabelText(/switch to dark mode/i)
    const languageToggle = screen.getByLabelText(/switch language/i)
    
    expect(themeToggle).toBeInTheDocument()
    expect(languageToggle).toBeInTheDocument()
  })

  it('should toggle theme and update app background colors', async () => {
    render(<App />)
    
    // Find the main app container
    const appContainer = document.querySelector('.min-h-screen')
    expect(appContainer).toBeInTheDocument()
    
    // Initially should have light theme classes
    expect(appContainer).toHaveClass('from-gray-50', 'to-gray-100')
    
    // Click the theme toggle
    const themeToggle = screen.getByLabelText(/switch to dark mode/i)
    await user.click(themeToggle)
    
    // Verify theme toggle state changed
    expect(themeToggle).toHaveAttribute('aria-pressed', 'true')
    expect(themeToggle).toHaveAttribute('aria-label', 'Switch to light mode')
    
    // Verify localStorage was called
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('should allow both controls to work independently', async () => {
    const { rerender } = render(<App />)
    
    const themeToggle = screen.getByLabelText(/switch to dark mode/i)
    const languageToggle = screen.getByLabelText(/switch language/i)
    
    // Initial states - theme is light (false), language is English so aria-pressed is false (!isEnglish = !true = false)
    expect(themeToggle).toHaveAttribute('aria-pressed', 'false')
    expect(languageToggle).toHaveAttribute('aria-pressed', 'false')
    
    // Toggle theme
    await user.click(themeToggle)
    expect(themeToggle).toHaveAttribute('aria-pressed', 'true')
    expect(languageToggle).toHaveAttribute('aria-pressed', 'false') // Should remain unchanged
    
    // Toggle language - this should change the language from 'en' to 'sl'
    await user.click(languageToggle)
    expect(mockChangeLanguage).toHaveBeenCalledWith('sl')
    
    // Rerender to reflect the language change
    rerender(<App />)
    
    // Now check states after language change
    const updatedThemeToggle = screen.getByLabelText(/switch to light mode/i)
    const updatedLanguageToggle = screen.getByLabelText(/switch language/i)
    
    expect(updatedThemeToggle).toHaveAttribute('aria-pressed', 'true') // Should remain changed
    expect(updatedLanguageToggle).toHaveAttribute('aria-pressed', 'true') // Now changed (language is 'sl', so !isEnglish = !false = true)
  })
}) 
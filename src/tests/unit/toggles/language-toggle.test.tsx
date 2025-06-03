import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { LanguageToggle } from '../../../components/toggles/language-toggle'
import { type ReactElement } from 'react'

// Mock react-i18next
const mockChangeLanguage = vi.fn()
const mockI18n = {
  language: 'en',
  changeLanguage: mockChangeLanguage,
}

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: mockI18n,
    t: (key: string) => {
      const translations: Record<string, string> = {
        'language.switchLanguage': 'Switch language',
        'accessibility.toggleButton': 'Toggle button',
        'accessibility.currentlySelected': 'Currently selected',
      }
      return translations[key] || key
    },
  }),
}))

const LanguageToggleWrapper = (): ReactElement => <LanguageToggle />

describe('LanguageToggle', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
    mockI18n.language = 'en'
  })

  it('should render the language toggle button', () => {
    render(<LanguageToggleWrapper />)
    
    const button = screen.getByRole('switch')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-label', 'Switch language')
  })

  it('should show correct initial state for English', () => {
    render(<LanguageToggleWrapper />)
    
    const button = screen.getByRole('switch')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('aria-checked', 'false')
  })

  it('should toggle from English to Slovenian when clicked', async () => {
    render(<LanguageToggleWrapper />)
    
    const button = screen.getByRole('switch')
    await user.click(button)
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('sl')
  })

  it('should be keyboard accessible', async () => {
    render(<LanguageToggleWrapper />)
    
    const button = screen.getByRole('switch')
    button.focus()
    
    await user.keyboard('{Enter}')
    
    expect(mockChangeLanguage).toHaveBeenCalledWith('sl')
  })
}) 
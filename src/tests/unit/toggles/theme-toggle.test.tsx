import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { ThemeToggle } from '../../../components/toggles/theme-toggle'
import { ThemeProvider } from '../../../contexts/theme-context'
import { type ReactElement } from 'react'

// Test wrapper component that provides theme context
const ThemeToggleWrapper = (): ReactElement => (
  <ThemeProvider>
    <ThemeToggle />
  </ThemeProvider>
)

describe('ThemeToggle', () => {
  const user = userEvent.setup()

  beforeEach(() => {
    vi.clearAllMocks()
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

  it('should render the theme toggle button', () => {
    render(<ThemeToggleWrapper />)
    
    const button = screen.getByRole('switch')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode')
  })

  it('should show correct initial state for light theme', () => {
    render(<ThemeToggleWrapper />)
    
    const button = screen.getByRole('switch')
    expect(button).toHaveAttribute('aria-pressed', 'false')
    expect(button).toHaveAttribute('aria-checked', 'false')
  })

  it('should toggle from light to dark theme when clicked', async () => {
    render(<ThemeToggleWrapper />)
    
    const button = screen.getByRole('switch')
    await user.click(button)
    
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode')
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })

  it('should be keyboard accessible', async () => {
    render(<ThemeToggleWrapper />)
    
    const button = screen.getByRole('switch')
    button.focus()
    
    await user.keyboard('{Enter}')
    
    expect(button).toHaveAttribute('aria-pressed', 'true')
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark')
  })
}) 
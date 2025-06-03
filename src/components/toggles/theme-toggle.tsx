import { Sun, Moon } from 'lucide-react';
import { type ReactElement } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../contexts/theme-context';

export const ThemeToggle = (): ReactElement => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();
  const isDark = theme === 'dark';

  const buttonId = 'theme-toggle-button';
  const descriptionId = 'theme-toggle-description';

  const getAriaDescription = () => {
    return `${t('accessibility.toggleButton')} - ${isDark ? t('theme.switchToLight') : t('theme.switchToDark')}`;
  };

  return (
    <div className="relative">
      <button
        id={buttonId}
        onClick={toggleTheme}
        className="group relative overflow-hidden rounded-xl p-2.5 glass-effect bg-white dark:bg-white-900/90 shadow-lg border border-gray-200/80 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500/30 dark:focus:ring-blue-400/30"
        aria-label={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
        aria-describedby={descriptionId}
        aria-pressed={isDark}
        role="switch"
        aria-checked={isDark}
        type="button"
      >
        {/* Background gradient that slides */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r transition-all duration-500 ease-in-out ${
            isDark 
              ? 'from-blue-600 to-indigo-600 translate-x-0' 
              : 'from-yellow-400 to-orange-500 -translate-x-full'
          }`}
          aria-hidden="true"
        />
        
        {/* Icon container */}
        <div className="relative z-10 flex items-center justify-center w-6 h-6">
          {/* Sun icon */}
          <Sun 
            className={`absolute h-4 w-4 transition-all duration-300 ${
              isDark 
                ? 'opacity-0 rotate-90 scale-50 text-white' 
                : 'opacity-100 rotate-0 scale-100 text-orange-600'
            }`}
            aria-hidden="true"
          />
          
          {/* Moon icon */}
          <Moon 
            className={`absolute h-4 w-4 transition-all duration-300 ${
              isDark 
                ? 'opacity-100 rotate-0 scale-100 text-white' 
                : 'opacity-0 -rotate-90 scale-50 text-blue-600'
            }`}
            aria-hidden="true"
          />
        </div>
        
        {/* Subtle glow effect */}
        <div 
          className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
            isDark 
              ? 'shadow-[0_0_15px_rgba(59,130,246,0.4)] opacity-50' 
              : 'shadow-[0_0_10px_rgba(0,0,0,0.1)] opacity-30'
          }`}
          aria-hidden="true"
        />
      </button>
      
      {/* Hidden description for screen readers */}
      <div id={descriptionId} className="sr-only">
        {getAriaDescription()}
      </div>
      
      {/* Optional tooltip */}
      <div 
        className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        role="tooltip"
        aria-hidden="true"
      >
        <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-lg whitespace-nowrap font-medium">
          {isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
        </div>
      </div>
    </div>
  );
}; 
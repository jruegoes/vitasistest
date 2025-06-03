import { Languages, Globe } from 'lucide-react';
import { type ReactElement, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageToggle = (): ReactElement => {
  const { i18n, t } = useTranslation();
  const currentLanguage = i18n.language;
  const isEnglish = currentLanguage === 'en';

  const toggleLanguage = () => {
    const newLanguage = isEnglish ? 'sl' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  const buttonId = 'language-toggle-button';
  const descriptionId = 'language-toggle-description';

  // Memoize aria description to avoid recalculation on every render
  const ariaDescription = useMemo(() => {
    const currentLang = isEnglish ? t('language.english') : t('language.slovenian');
    const targetLang = isEnglish ? t('language.slovenian') : t('language.english');
    return `${t('accessibility.toggleButton')} - ${t('accessibility.currentlySelected')}: ${currentLang}. ${t('language.switchLanguage')} ${targetLang}`;
  }, [isEnglish, t]);

  // Memoize gradient and shadow classes to avoid recalculation
  const backgroundGradient = useMemo(() => 
    isEnglish 
      ? 'from-blue-500 to-blue-600 translate-x-0' 
      : 'from-purple-500 to-purple-600 translate-x-0',
    [isEnglish]
  );

  const glowEffect = useMemo(() => 
    isEnglish 
      ? 'shadow-[0_0_15px_rgba(59,130,246,0.4)] opacity-50' 
      : 'shadow-[0_0_15px_rgba(147,51,234,0.4)] opacity-50',
    [isEnglish]
  );

  const tooltipText = useMemo(() => 
    isEnglish ? t('language.slovenian') : t('language.english'),
    [isEnglish, t]
  );

  return (
    <div className="relative">
      <button
        id={buttonId}
        onClick={toggleLanguage}
        className="group relative overflow-hidden rounded-xl p-2.5 glass-effect bg-white/80 dark:bg-gray-900/80 shadow-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500/30 dark:focus:ring-purple-400/30"
        aria-label={t('language.switchLanguage')}
        aria-describedby={descriptionId}
        aria-pressed={!isEnglish}
        role="switch"
        aria-checked={!isEnglish}
        type="button"
      >
        {/* Background gradient that slides */}
        <div 
          className={`absolute inset-0 bg-gradient-to-r transition-all duration-500 ease-in-out ${backgroundGradient}`}
          aria-hidden="true"
        />
        
        {/* Icon container */}
        <div className="relative z-10 flex items-center justify-center w-6 h-6">
          {/* Globe icon for English */}
          <Globe 
            className={`absolute h-4 w-4 transition-all duration-300 ${
              isEnglish 
                ? 'opacity-100 rotate-0 scale-100 text-white' 
                : 'opacity-0 rotate-90 scale-50 text-blue-600'
            }`}
            aria-hidden="true"
          />
          
          {/* Languages icon for Slovenian */}
          <Languages 
            className={`absolute h-4 w-4 transition-all duration-300 ${
              !isEnglish 
                ? 'opacity-100 rotate-0 scale-100 text-white' 
                : 'opacity-0 -rotate-90 scale-50 text-purple-600'
            }`}
            aria-hidden="true"
          />
        </div>
        
        {/* Subtle glow effect */}
        <div 
          className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${glowEffect}`}
          aria-hidden="true"
        />
      </button>
      
      {/* Hidden description for screen readers */}
      <div id={descriptionId} className="sr-only">
        {ariaDescription}
      </div>
      
      {/* Language indicator tooltip */}
      <div 
        className="absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        role="tooltip"
        aria-hidden="true"
      >
        <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs px-2 py-1 rounded-lg whitespace-nowrap font-medium">
          {tooltipText}
        </div>
      </div>
    </div>
  );
}; 
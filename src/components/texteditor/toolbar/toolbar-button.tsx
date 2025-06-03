import { useTranslation } from 'react-i18next';

export type ColorScheme = 'blue' | 'green' | 'purple' | 'red' | 'gray';

interface ToolbarButtonProps {
  onClick: () => void;
  isActive: boolean;
  children: React.ReactNode;
  label: string;
  colorScheme?: ColorScheme;
  shortcut?: string;
}

const colorClasses = {
  blue: {
    base: 'bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500',
    active: 'bg-blue-700 dark:bg-blue-800 ring-2 ring-blue-300 dark:ring-blue-400'
  },
  green: {
    base: 'bg-emerald-500 dark:bg-emerald-600 hover:bg-emerald-600 dark:hover:bg-emerald-500',
    active: 'bg-emerald-700 dark:bg-emerald-800 ring-2 ring-emerald-300 dark:ring-emerald-400'
  },
  purple: {
    base: 'bg-purple-500 dark:bg-purple-600 hover:bg-purple-600 dark:hover:bg-purple-500',
    active: 'bg-purple-700 dark:bg-purple-800 ring-2 ring-purple-300 dark:ring-purple-400'
  },
  red: {
    base: 'bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-500',
    active: 'bg-red-700 dark:bg-red-800 ring-2 ring-red-300 dark:ring-red-400'
  },
  gray: {
    base: 'bg-gray-500 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500',
    active: 'bg-gray-700 dark:bg-gray-800 ring-2 ring-gray-300 dark:ring-gray-400'
  }
};

/**
 * Modern, accessible toolbar button component
 */
export const ToolbarButton = ({
  onClick,
  isActive,
  children,
  label,
  colorScheme = 'blue',
  shortcut = ''
}: ToolbarButtonProps) => {
  const { t } = useTranslation();

  const ariaLabel = `${label}${shortcut ? ` (${shortcut})` : ''}${isActive ? ` - ${t('accessibility.active')}` : ` - ${t('accessibility.inactive')}`}`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        h-10 w-10 rounded-xl text-white font-medium 
        transition-all duration-200 ease-in-out transform
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-gray-800
        flex items-center justify-center
        ${isActive 
          ? colorClasses[colorScheme].active
          : colorClasses[colorScheme].base
        }
      `}
      aria-label={ariaLabel}
      aria-pressed={isActive}
      title={ariaLabel}
      role="button"
    >
      {children}
    </button>
  );
}; 
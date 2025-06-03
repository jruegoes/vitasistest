import type { TFunction } from 'i18next';

/**
 * Styling configurations for the model dropdown component
 */
export const dropdownStyles = {
  // Container styles
  container: "w-full max-w-md mb-6",
  
  // Label styles
  label: "block text-sm font-semibold font-inter text-gray-700 dark:text-gray-300 mb-3",
  labelContainer: "flex items-center justify-between",
  labelContent: "flex items-center gap-2",
  
  // Button styles
  listboxButton: `
    relative w-full cursor-pointer rounded-xl bg-white dark:bg-gray-800 py-3 pl-4 pr-10 text-left 
    shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 
    focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 
    disabled:cursor-not-allowed transition-all duration-200 hover:shadow-xl disabled:hover:shadow-lg
  `,
  
  buttonText: "block truncate font-medium font-inter text-gray-900 dark:text-gray-100",
  buttonIcon: "pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3",
  chevronIcon: "h-5 w-5 text-gray-400 dark:text-gray-500",
  
  // Options styles
  optionsList: `
    absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-gray-800 py-1 
    text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200 dark:border-gray-700
  `,
  
  // No models available styles
  noModelsContainer: `
    relative w-full rounded-xl bg-gray-100 dark:bg-gray-700 py-3 px-4 text-left 
    border border-gray-200 dark:border-gray-600 opacity-50
  `,
  noModelsText: "block text-gray-500 dark:text-gray-400 font-medium font-inter",
  
  // Warning styles
  warningContainer: "mt-3 flex items-center gap-2",
  warningDot: "h-2 w-2 bg-red-500 rounded-full animate-pulse",
  warningText: "text-xs text-gray-500 dark:text-gray-400 font-dm-sans",
  
  // Icon styles
  cpuIcon: "h-4 w-4 text-blue-500",
  cpuIconGray: "h-4 w-4 text-gray-400",
  checkIcon: "h-4 w-4",
  refreshIcon: "h-4 w-4 transition-transform duration-300"
} as const;

/**
 * Refresh button styling configurations
 */
export const refreshButtonStyles = {
  base: `
    group relative p-2 rounded-lg font-medium text-sm font-inter
    transition-colors duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-900
    disabled:opacity-50 disabled:cursor-not-allowed
    bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 
    text-white shadow-md
    focus:ring-emerald-500 dark:focus:ring-emerald-400
    hover:from-emerald-600 hover:to-emerald-700 dark:hover:from-emerald-700 dark:hover:to-emerald-800
    hover:shadow-lg
  `
} as const;

/**
 * Generate option item class based on state
 */
export const getOptionItemClass = (active: boolean): string => {
  const baseClass = "relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors duration-150";
  const activeClass = active 
    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100" 
    : "text-gray-900 dark:text-gray-100";
  
  return `${baseClass} ${activeClass}`;
};

/**
 * Generate option text class based on selection state
 */
export const getOptionTextClass = (selected: boolean): string => {
  const baseClass = "block truncate font-inter";
  const selectedClass = selected ? "font-semibold" : "font-normal";
  
  return `${baseClass} ${selectedClass}`;
};

/**
 * Generate refresh icon class based on loading state
 */
export const getRefreshIconClass = (isLoading: boolean): string => {
  const baseClass = dropdownStyles.refreshIcon;
  const loadingClass = isLoading ? "animate-spin" : "group-hover:rotate-180";
  
  return `${baseClass} ${loadingClass}`;
};

/**
 * Generate accessibility descriptions for the dropdown
 */
export const getAccessibilityDescriptions = (
  selectedModel: string | null,
  isStreaming: boolean,
  modelIndex: number,
  totalModels: number,
  t: TFunction
) => {
  return {
    dropdownDescription: `${t('accessibility.modelDropdown')}. ${
      selectedModel ? `${t('accessibility.currentlySelected')}: ${selectedModel}` : ''
    }${isStreaming ? ` ${t('recording.cannotChangeModelWhileRecording')}` : ''}`,
    
    optionDescription: `${
      selectedModel === `model-${modelIndex}` ? `${t('accessibility.currentlySelected')}, ` : ''
    }${t('recording.selectModel')} ${modelIndex + 1} ${t('accessibility.of', 'of')} ${totalModels}`,
    
    refreshButtonLabel: (isLoading: boolean) => 
      isLoading ? t('recording.refreshing') : t('recording.refreshModels')
  };
};

/**
 * Generate described-by attribute value
 */
export const getDescribedBy = (isStreaming: boolean): string => {
  return `model-dropdown-description ${isStreaming ? 'model-dropdown-warning' : ''}`.trim();
}; 
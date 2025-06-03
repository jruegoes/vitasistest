import { useTranslation } from 'react-i18next';

/**
 * Loading skeleton component for the editor
 * Shows a spinner and loading message while the editor is being loaded
 */
export const EditorLoading = () => {
  const { t } = useTranslation();
  
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-2xl shadow-lg bg-white dark:bg-gray-900 transition-colors overflow-hidden">
      <div className="p-8 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-4">
          {/* Loading spinner */}
          <div 
            className="w-8 h-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"
            aria-hidden="true"
          ></div>
          <p className="text-gray-600 dark:text-gray-400 font-dm-sans">
            {t('accessibility.loading')} {t('app.textEditorTitle')}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditorLoading; 
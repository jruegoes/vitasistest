import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';

/**
 * Placeholder component shown when user is not authenticated
 * Displays a blurred editor preview with lock icon and login prompt
 */
export const EditorPlaceholder = () => {
  const { t } = useTranslation();
  
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-2xl shadow-lg bg-white dark:bg-gray-900 transition-colors overflow-hidden relative">
      {/* Blurred content overlay */}
      <div className="absolute inset-0 bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
        <div className="text-center space-y-4 p-8">
          <div className="flex justify-center">
            <div className="p-4 bg-gray-200 dark:bg-gray-700 rounded-full">
              <Lock className="h-8 w-8 text-gray-500 dark:text-gray-400" aria-hidden="true" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold font-montserrat text-gray-700 dark:text-gray-300">
              {t('editor.loginRequired')}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-dm-sans max-w-xs">
              {t('editor.loginRequiredDescription')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Blurred editor preview */}
      <div className="p-8 min-h-[300px] filter blur-sm select-none pointer-events-none" aria-hidden="true">
        <div className="space-y-4">
          {/* Mock toolbar */}
          <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-t-2xl">
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded" aria-hidden="true"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded" aria-hidden="true"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded" aria-hidden="true"></div>
            </div>
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-600" aria-hidden="true"></div>
            <div className="flex gap-2">
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded" aria-hidden="true"></div>
              <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded" aria-hidden="true"></div>
            </div>
          </div>
          
          {/* Mock content area */}
          <div className="space-y-3 p-6">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" aria-hidden="true"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" aria-hidden="true"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3" aria-hidden="true"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPlaceholder; 
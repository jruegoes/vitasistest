import { Fragment, useMemo } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronsUpDown, Cpu, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  dropdownStyles,
  refreshButtonStyles,
  getOptionItemClass,
  getOptionTextClass,
  getRefreshIconClass,
  getAccessibilityDescriptions,
  getDescribedBy
} from '../../styles/model-dropdown-styles';

interface ModelDropdownProps {
  selectedModel: string;
  availableModels: string[];
  isStreaming: boolean;
  isInitialized: boolean;
  isLoadingStages: boolean;
  onModelChange: (model: string) => void;
  onRefreshModels: () => Promise<void>;
}

export const ModelDropdown = ({
  selectedModel,
  availableModels,
  isStreaming,
  isInitialized,
  isLoadingStages,
  onModelChange,
  onRefreshModels,
}: ModelDropdownProps) => {
  const { t } = useTranslation();

  // Memoize computed values to avoid recalculations
  const isRefreshDisabled = useMemo(() => 
    !isInitialized || isLoadingStages, 
    [isInitialized, isLoadingStages]
  );

  const accessibilityDescriptions = useMemo(() => 
    getAccessibilityDescriptions(selectedModel, isStreaming, 0, availableModels.length, t), 
    [selectedModel, isStreaming, availableModels.length, t]
  );

  const describedBy = useMemo(() => 
    getDescribedBy(isStreaming), 
    [isStreaming]
  );

  const refreshIconClass = useMemo(() => 
    getRefreshIconClass(isLoadingStages), 
    [isLoadingStages]
  );

  if (!availableModels || availableModels.length === 0) {
    return (
      <div className={dropdownStyles.container}>
        <div className={dropdownStyles.label}>
          <div className={dropdownStyles.labelContainer}>
            <div className={dropdownStyles.labelContent}>
              <Cpu className={dropdownStyles.cpuIconGray} aria-hidden="true" />
              {t('recording.selectModel')}
            </div>
            <button
              onClick={onRefreshModels}
              disabled={isRefreshDisabled}
              className={refreshButtonStyles.base}
              type="button"
              aria-label={accessibilityDescriptions.refreshButtonLabel(isLoadingStages)}
            >
              <RefreshCw 
                className={refreshIconClass}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
        <div 
          className={dropdownStyles.noModelsContainer}
          role="alert"
          aria-live="polite"
        >
          <span className={dropdownStyles.noModelsText}>
            {t('recording.noModelsAvailable')}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={dropdownStyles.container}>
      <Listbox 
        value={selectedModel} 
        onChange={onModelChange} 
        disabled={isStreaming}
        name="model-selection"
      >
        <div className="relative">
          <Listbox.Label className={dropdownStyles.label}>
            <div className={dropdownStyles.labelContainer}>
              <div className={dropdownStyles.labelContent}>
                <Cpu className={dropdownStyles.cpuIcon} aria-hidden="true" />
                {t('recording.selectModel')}
              </div>
              <button
                onClick={onRefreshModels}
                disabled={isRefreshDisabled}
                className={refreshButtonStyles.base}
                type="button"
                aria-label={accessibilityDescriptions.refreshButtonLabel(isLoadingStages)}
              >
                <RefreshCw 
                  className={refreshIconClass}
                  aria-hidden="true"
                />
              </button>
            </div>
          </Listbox.Label>
          
          <div 
            id="model-dropdown-description" 
            className="sr-only"
          >
            {accessibilityDescriptions.dropdownDescription}
          </div>
          
          <Listbox.Button 
            className={dropdownStyles.listboxButton}
            aria-describedby={describedBy}
            aria-expanded="false"
          >
            <span className={dropdownStyles.buttonText}>
              {selectedModel || t('recording.selectModel')}
            </span>
            <span className={dropdownStyles.buttonIcon}>
              <ChevronsUpDown
                className={dropdownStyles.chevronIcon}
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className={dropdownStyles.optionsList}>
              {availableModels.map((model, index) => {
                const { optionDescription } = getAccessibilityDescriptions(
                  selectedModel,
                  isStreaming,
                  index,
                  availableModels.length,
                  t
                );
                
                return (
                  <Listbox.Option
                    key={model}
                    className={({ active }) => getOptionItemClass(active)}
                    value={model}
                  >
                    {({ selected }) => (
                      <>
                        <span className={getOptionTextClass(selected)}>
                          {model}
                        </span>
                        {selected ? (
                          <span 
                            className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 dark:text-blue-400"
                            aria-hidden="true"
                          >
                            <Check className={dropdownStyles.checkIcon} />
                          </span>
                        ) : null}
                        <span className="sr-only">
                          {optionDescription}
                        </span>
                      </>
                    )}
                  </Listbox.Option>
                );
              })}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      
      {isStreaming && (
        <div 
          id="model-dropdown-warning"
          className={dropdownStyles.warningContainer}
          role="alert"
          aria-live="polite"
        >
          <div className={dropdownStyles.warningDot} aria-hidden="true"></div>
          <p className={dropdownStyles.warningText}>
            {t('recording.cannotChangeModelWhileRecording')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ModelDropdown;

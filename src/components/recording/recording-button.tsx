import { useState } from "react";
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import '../../styles/recording-animations.css';

// Microphone SVG icon
const MicrophoneIcon = ({ isRecording }: { isRecording: boolean }) => (
  <div className="flex items-center gap-2">
    {isRecording && (
      <div 
        className="h-2 w-2 bg-red-400 rounded-full animate-pulse border border-white shadow-sm" 
        aria-hidden="true"
      />
    )}
    {isRecording ? (
      <Mic className="h-5 w-5" aria-hidden="true" />
    ) : (
      <MicOff className="h-5 w-5" aria-hidden="true" />
    )}
  </div>
);

interface RecordingButtonProps {
  isStreaming: boolean;
  isInitialized: boolean;
  browserSupported: boolean;
  onToggleRecording: () => Promise<void>;
}

export const RecordingButton = ({
  isStreaming,
  isInitialized,
  browserSupported,
  onToggleRecording,
}: RecordingButtonProps) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await onToggleRecording();
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !isInitialized || !browserSupported || isLoading;

  // Generate comprehensive accessibility description
  const getAriaDescription = () => {
    if (!browserSupported) {
      return t('errors.browserNotSupported');
    }
    if (!isInitialized) {
      return t('status.initializingMessage');
    }
    if (isLoading) {
      return `${t('accessibility.loading')}...`;
    }
    if (isStreaming) {
      return t('status.recordingActiveMessage');
    }
    return t('status.readyMessage');
  };

  const buttonId = 'main-recording-button';
  const descriptionId = 'recording-button-description';

  return (
    <div className="relative">
      <button
        id={buttonId}
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          group relative px-8 py-4 rounded-2xl font-medium text-sm font-inter
          transition-all duration-300 ease-in-out transform
          focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
          ${!isDisabled ? 'hover:scale-105 active:scale-95' : ''}
          ${isStreaming 
            ? `bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 
               text-white shadow-xl modern-pulse
               focus:ring-red-500 dark:focus:ring-red-400
               hover:from-red-600 hover:to-red-700 dark:hover:from-red-700 dark:hover:to-red-800` 
            : `bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 
               text-white shadow-lg
               focus:ring-blue-500 dark:focus:ring-blue-400
               hover:from-blue-600 hover:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800
               hover:shadow-xl`
          }
        `}
        type="button"
        aria-label={isStreaming ? t('recording.stopRecording') : t('recording.startRecording')}
        aria-describedby={descriptionId}
        aria-pressed={isStreaming}
        role="button"
      >
        <div className="flex items-center justify-center gap-3">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          ) : (
            <MicrophoneIcon isRecording={isStreaming} />
          )}
          <span className="font-medium">
            {isLoading 
              ? t('status.initializing')
              : isStreaming 
                ? t('recording.stopRecording')
                : t('recording.startRecording')
            }
          </span>
        </div>
      </button>
      
      {/* Hidden description for screen readers */}
      <div id={descriptionId} className="sr-only">
        {getAriaDescription()}
      </div>
      
      {/* Initialization status indicator */}
      {!isInitialized && browserSupported && (
        <div 
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2"
          role="status"
          aria-live="polite"
        >
          <span className="text-xs text-gray-500 dark:text-gray-400 font-dm-sans">
            {t('status.initializing')}...
          </span>
        </div>
      )}
    </div>
  );
};

export default RecordingButton;

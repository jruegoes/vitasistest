import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, CheckCircle } from 'lucide-react';

interface TransferTextButtonProps {
  /** The buffered text to transfer */
  bufferText: string;
  /** Whether recording is currently active */
  isRecording: boolean;
  /** Callback to transfer text to editor */
  onTransferText: (text: string) => void;
  /** Callback to clear the buffer */
  onClearBuffer: () => void;
}

/**
 * Button component for transferring buffered text to the editor
 * Shows when there's text in the buffer and recording is not active
 */
export const TransferTextButton = ({
  bufferText,
  isRecording,
  onTransferText,
  onClearBuffer,
}: TransferTextButtonProps) => {
  const { t } = useTranslation();
  const [isTransferring, setIsTransferring] = useState(false);
  const [justTransferred, setJustTransferred] = useState(false);

  // Only show if there's buffer text and not currently recording
  const shouldShow = bufferText.trim() && !isRecording;

  const handleTransfer = useCallback(async () => {
    if (!bufferText.trim() || isTransferring) return;

    setIsTransferring(true);

    try {
      // Transfer the text to editor
      onTransferText(bufferText);
      
      // Clear the buffer
      onClearBuffer();
      
      // Show success state briefly
      setJustTransferred(true);
      setTimeout(() => {
        setJustTransferred(false);
      }, 1500);
      
    } catch (error) {
      console.error('Failed to transfer text:', error);
    } finally {
      setIsTransferring(false);
    }
  }, [bufferText, isTransferring, onTransferText, onClearBuffer]);

  const handleDiscard = useCallback(() => {
    onClearBuffer();
  }, [onClearBuffer]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div 
      className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl"
      role="region"
      aria-labelledby="transfer-text-label"
    >
      <div className="flex-1">
        <h4 
          id="transfer-text-label"
          className="text-sm font-semibold font-inter text-amber-800 dark:text-amber-200 mb-1"
        >
          {t('recording.bufferTextAvailable')}
        </h4>
        <p className="text-xs text-amber-700 dark:text-amber-300 font-dm-sans">
          {t('recording.bufferTextDescription')}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={isTransferring || justTransferred}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg font-semibold font-inter text-sm
            transition-all duration-200 transform hover:scale-105 active:scale-95
            focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
            ${justTransferred
              ? 'bg-green-500 hover:bg-green-600 focus:ring-green-500 text-white'
              : 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500 text-white'
            }
          `}
          aria-label={t('recording.transferToEditor')}
        >
          {isTransferring ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true" />
              {t('recording.transferring')}
            </>
          ) : justTransferred ? (
            <>
              <CheckCircle className="h-4 w-4" aria-hidden="true" />
              {t('recording.transferred')}
            </>
          ) : (
            <>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              {t('recording.transferToEditor')}
            </>
          )}
        </button>

        {/* Discard Button */}
        <button
          onClick={handleDiscard}
          disabled={isTransferring}
          className="
            px-3 py-2 rounded-lg font-medium font-inter text-sm
            bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
            hover:bg-gray-300 dark:hover:bg-gray-600
            transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 dark:focus:ring-offset-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label={t('recording.discardBuffer')}
        >
          {t('recording.discard')}
        </button>
      </div>
    </div>
  );
};

export default TransferTextButton; 
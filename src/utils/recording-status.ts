import { AlertCircle, CheckCircle, Info, Radio, AlertTriangle, Clock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TFunction } from 'i18next';

export type SystemStatusType = 'error' | 'initializing' | 'recording' | 'warning' | 'ready' | 'autoStopped';

export interface SystemStatus {
  type: SystemStatusType;
  title: string;
  message: string;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  titleColor: string;
  messageColor: string;
}

interface StatusConditions {
  hasError: boolean;
  error?: string | null;
  authError?: string | null;
  isInitialized: boolean;
  browserSupported: boolean;
  isStreaming: boolean;
  selectedModel?: string | null;
  availableModels?: string[];
  wasAutoStopped?: boolean;
}

/**
 * Determines the current system status based on various conditions
 */
export const getSystemStatus = (conditions: StatusConditions, t: TFunction): SystemStatus | null => {
  const { hasError, error, authError, isInitialized, browserSupported, isStreaming, selectedModel, availableModels, wasAutoStopped } = conditions;

  if (hasError || error || authError) {
    return {
      type: 'error',
      title: t('status.error'),
      message: error || authError || '',
      icon: AlertCircle,
      bgColor: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-500',
      titleColor: 'text-red-900 dark:text-red-100',
      messageColor: 'text-red-800 dark:text-red-200'
    };
  }

  if (wasAutoStopped && !isStreaming) {
    return {
      type: 'autoStopped',
      title: t('status.autoStoppedDueToSilence'),
      message: t('status.autoStoppedMessage'),
      icon: Clock,
      bgColor: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      borderColor: 'border-orange-200 dark:border-orange-800',
      iconColor: 'text-orange-500',
      titleColor: 'text-orange-900 dark:text-orange-100',
      messageColor: 'text-orange-800 dark:text-orange-200'
    };
  }

  if (!isInitialized && browserSupported) {
    return {
      type: 'initializing',
      title: t('status.initializing'),
      message: t('status.initializingMessage'),
      icon: Info,
      bgColor: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-500',
      titleColor: 'text-blue-900 dark:text-blue-100',
      messageColor: 'text-blue-800 dark:text-blue-200'
    };
  }

  if (isStreaming) {
    return {
      type: 'recording',
      title: t('status.recordingActive'),
      message: t('status.recordingActiveWithTimeout'),
      icon: Radio,
      bgColor: 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      iconColor: 'text-red-500',
      titleColor: 'text-red-900 dark:text-red-100',
      messageColor: 'text-red-800 dark:text-red-200'
    };
  }

  if (isInitialized && (!selectedModel || !availableModels || availableModels.length === 0)) {
    return {
      type: 'warning',
      title: t('status.modelRequired'),
      message: t('status.modelRequiredMessage'),
      icon: AlertTriangle,
      bgColor: 'from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      iconColor: 'text-yellow-500',
      titleColor: 'text-yellow-900 dark:text-yellow-100',
      messageColor: 'text-yellow-800 dark:text-yellow-200'
    };
  }

  if (isInitialized && selectedModel) {
    return {
      type: 'ready',
      title: t('status.ready'),
      message: t('status.readyMessage'),
      icon: CheckCircle,
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
      iconColor: 'text-green-500',
      titleColor: 'text-green-900 dark:text-green-100',
      messageColor: 'text-green-800 dark:text-green-200'
    };
  }

  return null;
}; 
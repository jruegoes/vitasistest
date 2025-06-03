import { useState, useEffect, useCallback, useMemo } from "react";
import { useSTTStream } from "../../hooks/useSTTStream";
import { useAuth } from "../../contexts/auth-context";
import { useTranslation } from 'react-i18next';
import { Clock, LogOut } from 'lucide-react';
import ModelDropdown from "./model-dropdown";
import RecordingButton from "./recording-button";
import LoginForm from "./login-form";
import TransferTextButton from "./transfer-text-button";
import { getSystemStatus } from "../../utils/recording-status";

interface RecordingTabProps {
  onTranscript: (text: string) => void;
  language?: string;
}

export const RecordingTab = ({ onTranscript }: RecordingTabProps) => {
  const { t } = useTranslation();
  const { isAuthenticated, isCheckingAuth, login, logout } = useAuth();
  const [buffer, setBuffer] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [browserSupported, setBrowserSupported] = useState(true);
  
  // Check browser support for WebAudio
  useEffect(() => {
    if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Your browser does not support WebAudio!");
      setBrowserSupported(false);
      setAuthError(t('errors.browserNotSupported'));
    }
  }, [t]);
  
  const { 
    start, 
    stop, 
    isStreaming, 
    error, 
    getPipelineStages, 
    isLoadingStages,
    changeModel,
    selectedModel,
    availableModels,
    wasAutoStopped
  } = useSTTStream({
    onText: (text, isFinal) => {
      console.log(`Received transcript (${isFinal ? 'final' : 'interim'}): "${text}"`);
      if (isFinal) {
        onTranscript(text);
        setBuffer("");
      } else {
        setBuffer(text);
      }
    }
  });

  // Fetch models when authenticated
  useEffect(() => {
    if (isAuthenticated && !isCheckingAuth) {
      console.log("User is authenticated, fetching available models...");
      getPipelineStages().catch(err => {
        console.error("Failed to fetch pipeline stages:", err);
        setAuthError(t('errors.authenticationFailed'));
      });
    }
  }, [isAuthenticated, isCheckingAuth, getPipelineStages, t]);

  // Handle successful login
  const handleLoginSuccess = useCallback(async () => {
    console.log("Login successful, setting up application...");
    login(); // Update auth context
    setAuthError(null);
    
    // Fetch available models after successful authentication
    try {
      await getPipelineStages();
    } catch (err) {
      console.error("Failed to fetch pipeline stages during login:", err);
      setAuthError(t('errors.authenticationFailed'));
    }
  }, [login, getPipelineStages, t]);

  // Handle logout
  const handleLogout = useCallback(() => {
    console.log("User logging out...");
    logout(); // Update auth context
    setAuthError(null);
    
    // Stop recording if active
    if (isStreaming) {
      stop();
    }
    
    // Clear any buffered text
    setBuffer("");
  }, [logout, isStreaming, stop]);

  // Handle transferring buffer text to editor
  const handleTransferText = useCallback((text: string) => {
    console.log("Transferring buffered text to editor:", text);
    onTranscript(text);
  }, [onTranscript]);

  // Handle clearing the buffer
  const handleClearBuffer = useCallback(() => {
    console.log("Clearing transcript buffer");
    setBuffer("");
  }, []);

  // Memoize event handlers to prevent child re-renders
  const handleMicClick = useCallback(async () => {
    // Double check browser support before proceeding
    if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      console.error("Your browser does not support WebAudio!");
      setAuthError(t('errors.browserNotSupported'));
      return;
    }
    
    console.log(`MicButton: ${isStreaming ? 'Stopping' : 'Starting'} microphone...`);
    if (isStreaming) {
      stop();
    } else {
      try {
        await start();
      } catch (err) {
        console.error("MicButton: Failed to start microphone", err);
        // Check if it's an authentication error
        if (err instanceof Error && err.message.includes('access token')) {
          setAuthError(t('auth.tokenExpired'));
          logout();
        }
      }
    }
  }, [isStreaming, stop, start, logout]);

  const handleFetchStages = useCallback(async () => {
    try {
      const stagesData = await getPipelineStages();
      console.log("Fetched pipeline stages:", stagesData);
    } catch (err) {
      console.error("Failed to fetch pipeline stages:", err);
      // Check if it's an authentication error
      if (err instanceof Error && err.message.includes('access token')) {
        setAuthError(t('auth.tokenExpired'));
        logout();
      }
    }
  }, [getPipelineStages, t, logout]);
  
  const handleModelChange = useCallback((model: string) => {
    changeModel(model);
  }, [changeModel]);

  // Memoize expensive status calculation
  const systemStatus = useMemo(() => {
    if (!isAuthenticated) return null;
    
    return getSystemStatus({
      hasError: Boolean(error || authError),
      error,
      authError,
      isInitialized: isAuthenticated,
      browserSupported,
      isStreaming,
      selectedModel,
      availableModels,
      wasAutoStopped
    }, t);
  }, [error, authError, isAuthenticated, browserSupported, isStreaming, selectedModel, availableModels, wasAutoStopped, t]);

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-8">
        <div className="w-8 h-8 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin"></div>
        <p className="text-gray-600 dark:text-gray-400 font-dm-sans">
          {t('status.initializing')}...
        </p>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center space-y-8 p-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <h1 
            id="recording-section-title"
            className="text-3xl font-bold font-montserrat text-gray-900 dark:text-gray-100"
          >
            {t('app.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 font-dm-sans">
            {t('app.description')}
          </p>
        </header>

        {/* Login Form */}
        <div className="w-full max-w-md">
          <LoginForm onLoginSuccess={handleLoginSuccess} />
        </div>

        {/* Show authentication error if any */}
        {authError && (
          <div className="w-full max-w-2xl">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 text-red-500 flex-shrink-0">⚠️</div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold font-inter text-red-900 dark:text-red-100 mb-1">
                    {t('status.error')}
                  </h3>
                  <p className="text-red-800 dark:text-red-200 font-dm-sans text-sm leading-relaxed">
                    {authError}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show main recording interface when authenticated
  return (
    <div className="flex flex-col items-center space-y-8 p-6">
      {/* Header with Logout */}
      <header className="text-center space-y-2 relative w-full">
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="absolute top-0 right-0 flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label={t('auth.logout')}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
          {t('auth.logout')}
        </button>

        <h1 
          id="recording-section-title"
          className="text-3xl font-bold font-montserrat text-gray-900 dark:text-gray-100"
        >
          {t('app.title')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 font-dm-sans">
          {t('app.description')}
        </p>
      </header>

      {/* Model Selection Controls */}
      <ModelDropdown
        selectedModel={selectedModel || ""}
        availableModels={availableModels || []}
        isStreaming={isStreaming}
        isInitialized={isAuthenticated}
        isLoadingStages={isLoadingStages}
        onModelChange={handleModelChange}
        onRefreshModels={handleFetchStages}
      />
      
      {/* Recording Controls */}
      <div 
        className="flex flex-col items-center space-y-4"
        role="group"
        aria-labelledby="recording-controls-label"
      >
        <span id="recording-controls-label" className="sr-only">
          {t('accessibility.recordingButton')}
        </span>
        
        <RecordingButton
          isStreaming={isStreaming}
          isInitialized={isAuthenticated}
          browserSupported={browserSupported}
          onToggleRecording={handleMicClick}
        />
        
        {/* Auto-stop timeout indicator */}
        {(isAuthenticated && selectedModel) && (
          <div 
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg"
            role="note"
            aria-label={t('status.recordingActiveWithTimeout')}
          >
            <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" aria-hidden="true" />
            <span className="text-sm text-blue-700 dark:text-blue-300 font-dm-sans">
              {t('recording.autoStopAfterSilence')}
            </span>
          </div>
        )}
      </div>
      
      {/* Transfer Text Button */}
      <div className="w-full max-w-2xl">
        <TransferTextButton
          bufferText={buffer}
          isRecording={isStreaming}
          onTransferText={handleTransferText}
          onClearBuffer={handleClearBuffer}
        />
      </div>
      
      {/* Live Transcript Buffer */}
      {buffer && (
        <div className="w-full max-w-2xl">
          <div 
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800 shadow-lg"
            role="region"
            aria-labelledby="live-transcript-label"
            aria-live="polite"
            aria-atomic="false"
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center" aria-hidden="true">
                  <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="flex-1">
                <h3 
                  id="live-transcript-label"
                  className="text-sm font-semibold font-inter text-blue-900 dark:text-blue-100 mb-2"
                >
                  {t('status.liveTranscript')}
                </h3>
                <p 
                  className="text-blue-800 dark:text-blue-200 font-open-sans"
                  role="text"
                >
                  {buffer}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Status Messages */}
      {systemStatus && (
        <div className="w-full max-w-2xl">
          <div 
            className={`bg-gradient-to-r ${systemStatus.bgColor} rounded-2xl p-6 border ${systemStatus.borderColor} shadow-lg`}
            role="status"
            aria-labelledby="system-status-label"
            aria-live="polite"
            aria-atomic="true"
          >
            <div className="flex items-center gap-3">
              <systemStatus.icon 
                className={`h-5 w-5 ${systemStatus.iconColor} flex-shrink-0`}
                aria-hidden="true"
              />
              <div className="flex-1">
                <h3 
                  id="system-status-label"
                  className={`text-sm font-semibold font-inter ${systemStatus.titleColor} mb-1`}
                >
                  {systemStatus.title}
                </h3>
                <p className={`${systemStatus.messageColor} font-dm-sans text-sm leading-relaxed`}>
                  {systemStatus.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordingTab;

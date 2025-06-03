import { useEffect, useRef, useState, useCallback } from "react";
import { getValidToken } from "../api/auth";
import { sttAPIService } from "../services/stt-api-service";
import { webSocketService } from "../services/websocket-service";
import { audioProcessingService } from "../services/audio-processing-service";
import { 
  handleSTTMessage, 
  createConfigMessage, 
  createEOSMessage 
} from "../utils/stt-message-handlers";
import type { STTStreamState } from "../types/stt";

interface UseSTTStreamOptions {
  onText: (text: string, isFinal: boolean) => void;
  language?: string;
  silenceTimeoutMs?: number; // Optional silence timeout in milliseconds
}

export const useSTTStream = ({ 
  onText, 
  silenceTimeoutMs = 5000 // Default to 5 seconds
}: UseSTTStreamOptions) => {
  // State management
  const [state, setState] = useState<STTStreamState>({
    isStreaming: false,
    error: null,
    selectedModel: undefined,
    availableModels: [],
    isLoadingStages: false
  });

  // Auto-stop state
  const [wasAutoStopped, setWasAutoStopped] = useState(false);

  // Refs for cleanup and silence detection
  const streamRef = useRef<MediaStream | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimeRef = useRef<number>(0);
  const isStreamingRef = useRef(false);

  /**
   * Update state partially
   */
  const updateState = useCallback((updates: Partial<STTStreamState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };
      // Update the ref to always have current streaming state
      isStreamingRef.current = newState.isStreaming;
      return newState;
    });
  }, []);

  /**
   * Start the silence timer
   */
  const startSilenceTimer = useCallback(() => {
    console.log(`Starting silence timer for ${silenceTimeoutMs/1000} seconds...`);
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    
    lastSpeechTimeRef.current = Date.now();
    
    silenceTimerRef.current = setTimeout(() => {
      if (isStreamingRef.current) {
        console.log(`No speech detected for ${silenceTimeoutMs/1000} seconds, stopping recording...`);
        setWasAutoStopped(true); // Mark as auto-stopped
        stop();
      }
    }, silenceTimeoutMs);
  }, [silenceTimeoutMs]);

  /**
   * Reset the silence timer (restart it)
   */
  const resetSilenceTimer = useCallback(() => {
    if (isStreamingRef.current) {
      console.log("Speech detected, resetting silence timer...");
      startSilenceTimer();
    }
  }, [startSilenceTimer]);

  /**
   * Clear the silence timer
   */
  const clearSilenceTimer = useCallback(() => {
    console.log("Clearing silence timer...");
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  /**
   * Enhanced onText handler with silence detection
   */
  const handleTextWithSilenceDetection = useCallback((text: string, isFinal: boolean) => {
    // Reset silence timer when we receive any text
    resetSilenceTimer();
    
    // Call the original onText handler
    onText(text, isFinal);
    
    console.log(`Speech activity detected (${isFinal ? 'final' : 'interim'}): "${text}"`);
  }, [onText, resetSilenceTimer]);

  /**
   * Fetch pipeline stages and available models
   */
  const getPipelineStages = useCallback(async () => {
    updateState({ isLoadingStages: true, error: null });
    
    try {
      const models = await sttAPIService.getAvailableModels();
      updateState({ 
        availableModels: models,
        isLoadingStages: false 
      });
      return models;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch pipeline stages";
      updateState({ 
        error: errorMessage,
        isLoadingStages: false 
      });
      return null;
    }
  }, [updateState]);

  /**
   * Change the selected model
   */
  const changeModel = useCallback((modelTag: string) => {
    if (state.isStreaming) {
      console.warn("Cannot change model while streaming is active");
      return;
    }
    
    updateState({ selectedModel: modelTag });
    console.log(`Model changed to: ${modelTag}`);
  }, [state.isStreaming, updateState]);

  /**
   * Start audio streaming
   */
  const start = useCallback(async () => {
    try {
      console.log("Starting STT stream...");

      // Clear auto-stopped state when starting
      setWasAutoStopped(false);

      if (!state.selectedModel) {
        throw new Error("Please select an ASR model before starting.");
      }
      
      // Get authentication token
      console.log("Getting auth token...");
      const token = await getValidToken();
      if (!token) {
        throw new Error("No authentication token found. Please log in first.");
      }

      // Get audio stream
      console.log("Requesting microphone access...");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to WebSocket
      console.log("Connecting to WebSocket...");
      await webSocketService.connect(token);

      // Set up message handling
      const messageHandler = (event: MessageEvent) => {
        handleSTTMessage(event.data, {
          onText: handleTextWithSilenceDetection,
          onError: (error: string) => updateState({ error }),
          onInitialized: () => {
            console.log("Session initialized, sending configuration...");
            const configMessage = createConfigMessage(state.selectedModel!);
            webSocketService.send(configMessage);
          },
          onConfigured: () => {
            console.log("Session configured, starting audio processing...");
            updateState({ isStreaming: true, error: null });
            
            // Start silence detection timer after state is updated
            setTimeout(() => {
              startSilenceTimer();
            }, 100); // Small delay to ensure state is updated
            
            // Initialize audio processing
            const onAudioData = (data: ArrayBuffer) => {
              webSocketService.sendBinary(data);
            };
            
            audioProcessingService.initialize(stream, onAudioData)
              .catch(error => {
                console.error("Audio processing initialization failed:", error);
                updateState({ error: "Failed to initialize audio processing" });
                stop();
              });
          },
          onFinished: () => {
            console.log("Session finished");
            stop();
          },
          onWarning: (warning: string) => {
            console.warn("STT Warning:", warning);
          },
          onCriticalError: () => {
            console.error("Critical error occurred, stopping session");
            stop();
          }
        });
      };

      // Add message listener
      webSocketService.addEventListener('message', messageHandler);

      console.log("STT stream initialization completed");
    } catch (err) {
      console.error("Failed to start streaming:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to start streaming";
      updateState({ error: errorMessage });
      stop();
    }
  }, [state.selectedModel, handleTextWithSilenceDetection, updateState, startSilenceTimer]);

  /**
   * Stop audio streaming
   */
  const stop = useCallback(() => {
    console.log("Stopping STT stream...");
    
    // Clear silence timer
    clearSilenceTimer();
    
    // Send EOS message if connected
    if (webSocketService.isConnected()) {
      console.log("Sending EOS message...");
      const eosMessage = createEOSMessage(false);
      webSocketService.send(eosMessage);
    }
    
    // Clean up audio processing
    audioProcessingService.cleanup();
    
    // Stop audio tracks
    if (streamRef.current) {
      console.log("Stopping audio tracks...");
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Disconnect WebSocket
    webSocketService.disconnect();
    
    updateState({ isStreaming: false });
    console.log("STT stream stopped");
  }, [updateState, clearSilenceTimer]);

  // Clear auto-stopped state after 5 seconds
  useEffect(() => {
    if (wasAutoStopped) {
      const timer = setTimeout(() => {
        setWasAutoStopped(false);
      }, 5000); // Show notification for 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [wasAutoStopped]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearSilenceTimer();
      stop();
    };
  }, [stop, clearSilenceTimer]);

  // Auto-select first model when models are available
  useEffect(() => {
    if (state.availableModels.length > 0 && !state.selectedModel) {
      console.log("Auto-selecting first model:", state.availableModels[0]);
      changeModel(state.availableModels[0]);
    }
  }, [state.availableModels, state.selectedModel, changeModel]);

  return { 
    start, 
    stop, 
    isStreaming: state.isStreaming, 
    error: state.error, 
    getPipelineStages, 
    stages: null, // Legacy field, keeping for backward compatibility
    isLoadingStages: state.isLoadingStages,
    changeModel,
    selectedModel: state.selectedModel,
    availableModels: state.availableModels,
    wasAutoStopped // Expose auto-stopped state
  };
};

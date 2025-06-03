import type { 
  TrueBarSTTResponse, 
  TextSegment, 
  STTCallbacks 
} from '../types/stt';

/**
 * Text formatting utility for STT responses
 */
export const formatTextSegment = (textSegment: TextSegment): string => {
  if (!textSegment.tokens || textSegment.tokens.length === 0) {
    return "";
  }
  
  let result = "";
  for (let i = 0; i < textSegment.tokens.length; i++) {
    const token = textSegment.tokens[i];
    const prevToken = i > 0 ? textSegment.tokens[i - 1] : null;
    
    // Add space between tokens if needed
    if (i > 0 && !token.isLeftHanded && !prevToken?.isRightHanded) {
      result += " ";
    }
    
    result += token.text;
  }
  
  return result;
};

/**
 * Handler for STATUS messages
 */
export const handleStatusMessage = (
  message: TrueBarSTTResponse,
  callbacks: {
    onInitialized: () => void;
    onConfigured: () => void;
    onFinished: () => void;
  }
): void => {
  console.log("Status message received:", message.status);
  
  switch (message.status) {
    case 'INITIALIZED':
      console.log("Session initialized");
      callbacks.onInitialized();
      break;
      
    case 'CONFIGURED':
      console.log("Session configured, audio processing can begin");
      if (message.sessionId) {
        console.log("Session ID:", message.sessionId);
      }
      if (message.recordingId) {
        console.log("Recording ID:", message.recordingId);
      }
      callbacks.onConfigured();
      break;
      
    case 'FINISHED':
      console.log("Session finished");
      if (message.lengthMs) {
        console.log("Recording length:", message.lengthMs, "ms");
      }
      if (message.sessionLockKey) {
        console.log("Session locked with key:", message.sessionLockKey);
      }
      callbacks.onFinished();
      break;
      
    default:
      console.warn("Unexpected session status:", message.status);
  }
};

/**
 * Handler for TEXT_SEGMENT messages
 */
export const handleTextSegmentMessage = (
  message: TrueBarSTTResponse,
  onText: (text: string, isFinal: boolean) => void
): void => {
  if (!message.textSegment) {
    console.warn("TEXT_SEGMENT message without textSegment data");
    return;
  }

  const formattedText = formatTextSegment(message.textSegment);
  const isFinal = message.textSegment.isFinal;
  
  console.log(`Transcript (${isFinal ? "final" : "interim"}):`, formattedText);
  onText(formattedText, isFinal);
};

/**
 * Handler for WARNING messages
 */
export const handleWarningMessage = (
  message: TrueBarSTTResponse,
  onWarning?: (warning: string) => void
): void => {
  const warningText = message.message || "Unknown warning";
  console.warn("API Warning:", warningText);
  
  if (onWarning) {
    onWarning(warningText);
  }
};

/**
 * Handler for ERROR messages
 */
export const handleErrorMessage = (
  message: TrueBarSTTResponse,
  onError: (error: string) => void
): boolean => {
  const errorText = message.error?.message || message.message || "Unknown error";
  console.error("API Error:", message);
  onError(`API Error: ${errorText}`);
  
  // Determine if this is a critical error that should stop the session
  const criticalErrors = [
    'session closed',
    'authentication failed',
    'connection lost',
    'pipeline error'
  ];
  
  const isCritical = criticalErrors.some(critical => 
    errorText.toLowerCase().includes(critical)
  );
  
  console.log(`Error is ${isCritical ? 'critical' : 'non-critical'}`);
  return isCritical;
};

/**
 * Main message router for STT WebSocket messages
 */
export const handleSTTMessage = (
  messageData: string,
  callbacks: STTCallbacks & {
    onInitialized: () => void;
    onConfigured: () => void;
    onFinished: () => void;
    onWarning?: (warning: string) => void;
    onCriticalError?: () => void;
  }
): void => {
  try {
    const message: TrueBarSTTResponse = JSON.parse(messageData);
    console.log("WebSocket message received:", message);
    
    // Handle both messageType (new) and type (legacy) fields
    const messageType = message.messageType || message.type;
    
    switch (messageType) {
      case 'STATUS':
        handleStatusMessage(message, {
          onInitialized: callbacks.onInitialized,
          onConfigured: callbacks.onConfigured,
          onFinished: callbacks.onFinished
        });
        break;
        
      case 'TEXT_SEGMENT':
        handleTextSegmentMessage(message, callbacks.onText);
        break;
        
      case 'WARNING':
        handleWarningMessage(message, callbacks.onWarning);
        break;
        
      case 'ERROR':
        const isCritical = handleErrorMessage(message, callbacks.onError!);
        if (isCritical && callbacks.onCriticalError) {
          callbacks.onCriticalError();
        }
        break;
        
      default:
        console.warn("Unexpected message type:", messageType, message);
    }
  } catch (error) {
    console.error("Failed to parse WebSocket message:", error);
    if (callbacks.onError) {
      callbacks.onError("Failed to parse server message");
    }
  }
};

/**
 * Create configuration message for STT pipeline
 */
export const createConfigMessage = (modelTag: string) => {
  return {
    type: "CONFIG",
    pipeline: [
      {
        task: "ASR",
        exceptionHandlingPolicy: "THROW",
        config: {
          tag: modelTag,
          parameters: {
            enableInterims: true
          }
        }
      }
    ]
  };
};

/**
 * Create End of Stream (EOS) message
 */
export const createEOSMessage = (lockSession: boolean = false) => {
  return {
    messageType: "EOS",
    lockSession
  };
}; 
// ============================================================================
// ACTUALLY USED TYPES - Speech-to-Text Interfaces
// ============================================================================

export interface Token {
  isLeftHanded: boolean;
  isRightHanded: boolean;
  startOffsetMs: number;
  endOffsetMs: number;
  text: string;
}

export interface TextSegment {
  isFinal: boolean;
  startTimeMs: number;
  endTimeMs: number;
  tokens: Token[];
}

export interface ErrorInfo {
  id: string;
  timestamp: string;
  message: string;
}

export interface TrueBarSTTResponse {
  messageType?: string; // "STATUS", "TEXT_SEGMENT", "WARNING", "ERROR"
  type?: string; // Legacy field, keeping for backward compatibility
  status?: string; // "INITIALIZED", "CONFIGURED", "FINISHED"
  text?: string;
  id?: string;
  timestamp?: number;
  textSegment?: TextSegment;
  error?: ErrorInfo;
  message?: string; // For WARNING messages
  sessionId?: number; // For CONFIGURED status
  recordingId?: number; // For CONFIGURED status
  lengthMs?: number; // For FINISHED status
  sessionLockKey?: string; // For FINISHED status when session is locked
}

// ============================================================================
// API PIPELINE TYPES
// ============================================================================

export interface PipelineStage {
  task: string;
  configOptions: PipelineConfigOption[];
}

export interface PipelineConfigOption {
  tag: string;
  features: string[];
  [key: string]: any;
}

// ============================================================================
// SERVICE INTERFACES
// ============================================================================

export interface WebSocketMessage {
  messageType?: string;
  type?: string;
  [key: string]: any;
}

export interface AudioProcessingConfig {
  targetSampleRate: number;
  chunkSize: number;
}

export interface STTStreamState {
  isStreaming: boolean;
  error: string | null;
  selectedModel?: string;
  availableModels: string[];
  isLoadingStages: boolean;
}

export interface STTCallbacks {
  onText: (text: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onStateChange?: (state: Partial<STTStreamState>) => void;
}

export interface WebSocketService {
  connect: (token: string) => Promise<WebSocket>;
  disconnect: () => void;
  send: (message: WebSocketMessage) => boolean;
  isConnected: () => boolean;
  getState: () => number;
}

export interface AudioProcessingService {
  initialize: (stream: MediaStream, onAudioData: (data: ArrayBuffer) => void) => Promise<void>;
  cleanup: () => void;
  isInitialized: () => boolean;
}

export interface STTAPIService {
  getPipelineStages: () => Promise<PipelineStage[]>;
  getAvailableModels: () => Promise<string[]>;
}

// Message type constants
export const STT_MESSAGE_TYPES = {
  STATUS: 'STATUS',
  TEXT_SEGMENT: 'TEXT_SEGMENT',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  CONFIG: 'CONFIG',
  EOS: 'EOS'
} as const;

export const STT_STATUS_TYPES = {
  INITIALIZED: 'INITIALIZED',
  CONFIGURED: 'CONFIGURED',
  FINISHED: 'FINISHED'
} as const;

export type STTMessageType = typeof STT_MESSAGE_TYPES[keyof typeof STT_MESSAGE_TYPES];
export type STTStatusType = typeof STT_STATUS_TYPES[keyof typeof STT_STATUS_TYPES];  
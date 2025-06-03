import type { AudioProcessingService, AudioProcessingConfig } from '../types/stt';

/**
 * Service for handling audio processing operations
 */
class AudioProcessingServiceImpl implements AudioProcessingService {
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private scriptNode: ScriptProcessorNode | null = null;
  private worker: Worker | null = null;
  private stream: MediaStream | null = null;
  
  private readonly config: AudioProcessingConfig = {
    targetSampleRate: 16000,
    chunkSize: 4096
  };

  /**
   * Initialize audio processing with the given stream
   */
  async initialize(
    stream: MediaStream, 
    onAudioData: (data: ArrayBuffer) => void
  ): Promise<void> {
    console.log("Initializing audio processing...");

    // Store the stream reference
    this.stream = stream;

    // Initialize AudioContext with target sample rate
    console.log("Creating AudioContext...");
    this.audioContext = new AudioContext({ 
      sampleRate: this.config.targetSampleRate 
    });
    console.log(`AudioContext initialized with sample rate: ${this.audioContext.sampleRate}Hz`);

    // Initialize worker
    await this.initializeWorker(onAudioData);

    // Set up audio processing chain
    this.setupAudioChain(stream);

    console.log("Audio processing initialized successfully");
  }

  /**
   * Clean up all audio processing resources
   */
  cleanup(): void {
    console.log("Cleaning up audio processing...");

    // Disconnect audio nodes
    if (this.scriptNode) {
      console.log("Disconnecting script processor node...");
      this.scriptNode.disconnect();
      this.scriptNode = null;
    }

    if (this.sourceNode) {
      console.log("Disconnecting audio source node...");
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    // Close AudioContext
    if (this.audioContext && this.audioContext.state !== 'closed') {
      console.log("Closing AudioContext...");
      this.audioContext.close().catch(console.error);
      this.audioContext = null;
    }

    // Stop audio tracks
    if (this.stream) {
      console.log("Stopping audio tracks...");
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    // Terminate worker
    if (this.worker) {
      console.log("Terminating audio processing worker");
      this.worker.terminate();
      this.worker = null;
    }

    console.log("Audio processing cleanup completed");
  }

  /**
   * Check if audio processing is initialized
   */
  isInitialized(): boolean {
    return (
      this.audioContext !== null &&
      this.audioContext.state !== 'closed' &&
      this.worker !== null &&
      this.sourceNode !== null &&
      this.scriptNode !== null
    );
  }

  /**
   * Get current audio context state
   */
  getAudioContextState(): AudioContextState | null {
    return this.audioContext?.state ?? null;
  }

  /**
   * Resume audio context if suspended
   */
  async resumeAudioContext(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      console.log("Resuming audio context...");
      await this.audioContext.resume();
    }
  }

  /**
   * Initialize the audio processing worker
   */
  private async initializeWorker(onAudioData: (data: ArrayBuffer) => void): Promise<void> {
    if (typeof Worker === 'undefined') {
      throw new Error("Web Workers are not supported in this browser");
    }

    console.log("Initializing audio processing worker...");
    
    try {
      this.worker = new Worker(
        new URL('../workers/AudioChunkProcessor.js', import.meta.url), 
        { type: 'module' }
      );

      // Set up worker message handler
      this.worker.onmessage = (e) => {
        if (e.data instanceof ArrayBuffer) {
          console.log(`Processed audio data: ${e.data.byteLength} bytes`);
          onAudioData(e.data);
        } else {
          console.error("Worker returned non-ArrayBuffer data:", e.data);
        }
      };

      this.worker.onerror = (error) => {
        console.error("Audio worker error:", error);
        throw new Error("Audio processing worker failed");
      };

      console.log("Audio processing worker initialized successfully");
    } catch (error) {
      console.error("Failed to initialize audio worker:", error);
      throw error;
    }
  }

  /**
   * Set up the audio processing chain
   */
  private setupAudioChain(stream: MediaStream): void {
    if (!this.audioContext || !this.worker) {
      throw new Error("AudioContext or Worker not initialized");
    }

    console.log("Setting up audio processing chain...");

    // Create source node from microphone stream
    console.log("Creating audio source node...");
    this.sourceNode = this.audioContext.createMediaStreamSource(stream);

    // Create script processor node
    console.log("Creating script processor node...");
    this.scriptNode = this.audioContext.createScriptProcessor(
      this.config.chunkSize, 
      1, // input channels
      1  // output channels
    );

    // Set up audio processing callback
    this.scriptNode.onaudioprocess = (event) => {
      if (!this.worker) {
        console.warn("Worker not available for audio processing");
        return;
      }

      const inputBuffer = event.inputBuffer.getChannelData(0);
      console.log("Processing audio chunk...", `${inputBuffer.length} samples`);
      
      this.worker.postMessage({
        audioChunk: inputBuffer,
        sourceSampleRate: this.audioContext!.sampleRate,
        targetSampleRate: this.config.targetSampleRate
      });
    };

    // Connect the audio processing chain
    console.log("Connecting audio processing chain...");
    this.sourceNode.connect(this.scriptNode);
    // Connect to destination to ensure audio processing continues
    // This is required for the script processor to actually process audio
    this.scriptNode.connect(this.audioContext.destination);
    
    console.log("Audio processing chain connected successfully");
  }

  /**
   * Get audio processing configuration
   */
  getConfig(): AudioProcessingConfig {
    return { ...this.config };
  }

  /**
   * Update audio processing configuration
   * Note: Requires reinitialization to take effect
   */
  updateConfig(config: Partial<AudioProcessingConfig>): void {
    Object.assign(this.config, config);
    console.log("Audio processing config updated:", this.config);
  }
}

// Export singleton instance
export const audioProcessingService = new AudioProcessingServiceImpl();

// Export class for testing purposes
export { AudioProcessingServiceImpl }; 
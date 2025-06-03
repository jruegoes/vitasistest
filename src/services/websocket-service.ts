import { ENDPOINTS } from '../config/api';
import type { WebSocketService, WebSocketMessage } from '../types/stt';

/**
 * Service for managing WebSocket connections to the STT API
 */
class WebSocketServiceImpl implements WebSocketService {
  private ws: WebSocket | null = null;

  /**
   * Connect to the WebSocket server
   */
  async connect(token: string): Promise<WebSocket> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return this.ws;
    }

    const wsUrl = `${ENDPOINTS.STT.WEBSOCKET_STREAM}?access_token=${token}`;
    console.log(`Connecting to WebSocket: ${wsUrl}`);

    return new Promise((resolve, reject) => {
      const ws = new WebSocket(wsUrl);
      
      const timeout = setTimeout(() => {
        reject(new Error('WebSocket connection timeout'));
      }, 10000); // 10 second timeout

      ws.onopen = () => {
        console.log('✅ WebSocket OPENED successfully');
        clearTimeout(timeout);
        this.ws = ws;
        resolve(ws);
      };

      ws.onerror = (error) => {
        console.error('❌ WebSocket ERROR occurred:', error);
        clearTimeout(timeout);
        reject(new Error('WebSocket connection failed'));
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket CLOSED');
        console.log('Close code:', event.code);
        console.log('Close reason:', event.reason || 'No reason provided');
        console.log('Was clean close:', event.wasClean);
        
        this.debugCloseCode(event.code);
        this.ws = null;
      };
    });
  }

  /**
   * Disconnect from the WebSocket server
   */
  disconnect(): void {
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
        console.log("Closing WebSocket connection...");
        this.ws.close();
      }
      this.ws = null;
    }
  }

  /**
   * Send a message through the WebSocket
   */
  send(message: WebSocketMessage): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send message: WebSocket not connected');
      return false;
    }

    try {
      const messageStr = JSON.stringify(message);
      console.log('Sending WebSocket message:', messageStr);
      this.ws.send(messageStr);
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  /**
   * Send binary data through the WebSocket
   */
  sendBinary(data: ArrayBuffer): boolean {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('Cannot send binary data: WebSocket not connected');
      return false;
    }

    try {
      console.log(`Sending binary data: ${data.byteLength} bytes`);
      this.ws.send(data);
      return true;
    } catch (error) {
      console.error('Error sending binary data:', error);
      return false;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Get current WebSocket state
   */
  getState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  /**
   * Add event listener to the WebSocket
   */
  addEventListener<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (event: WebSocketEventMap[K]) => void
  ): void {
    if (this.ws) {
      this.ws.addEventListener(type, listener);
    }
  }

  /**
   * Remove event listener from the WebSocket
   */
  removeEventListener<K extends keyof WebSocketEventMap>(
    type: K,
    listener: (event: WebSocketEventMap[K]) => void
  ): void {
    if (this.ws) {
      this.ws.removeEventListener(type, listener);
    }
  }

  /**
   * Debug WebSocket close codes
   */
  private debugCloseCode(code: number): void {
    switch(code) {
      case 1000: console.log('Normal closure'); break;
      case 1001: console.log('Going away'); break;
      case 1002: console.log('Protocol error'); break;
      case 1003: console.log('Unsupported data'); break;
      case 1006: console.log('Abnormal closure (network issue)'); break;
      case 1007: console.log('Invalid frame payload data'); break;
      case 1008: console.log('Policy violation'); break;
      case 1011: console.log('Server error'); break;
      default: console.log('Unknown close code:', code);
    }
  }

  /**
   * Get readable WebSocket state
   */
  getReadableState(): string {
    const states = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];
    return states[this.getState()] || 'UNKNOWN';
  }
}

// Export singleton instance
export const webSocketService = new WebSocketServiceImpl();

// Export class for testing purposes
export { WebSocketServiceImpl }; 
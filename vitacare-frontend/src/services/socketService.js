import { io } from 'socket.io-client';

// Global flags
let hasShownSocketWarning = false;
let socketEnabled = process.env.REACT_APP_ENABLE_SOCKET !== 'false'; // Can be disabled via env var

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.connectionAttempted = false;
  }

  connect(userId, token) {
    // Skip if Socket.IO is disabled
    if (!socketEnabled) {
      if (!hasShownSocketWarning) {
        console.info('ℹ️ Socket.IO disabled - using polling mode only');
        hasShownSocketWarning = true;
      }
      return;
    }

    // Skip if already connected
    if (this.socket?.connected) {
      return;
    }

    // Skip if already attempted and failed
    if (this.connectionAttempted && hasShownSocketWarning) {
      return;
    }

    try {
      const serverUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      this.socket = io(serverUrl, {
        path: '/socket.io',
        auth: {
          token
        },
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 2, // Reduced further
        timeout: 5000, // Reduced timeout
        transports: ['polling', 'websocket'],
        autoConnect: false, // Manual connection control
        forceNew: true
      });
      
      // Only connect if we have valid credentials
      if (userId && token) {
        this.socket.connect();
      } else {
        console.warn('Socket connection skipped: Missing userId or token');
        return;
      }

      this.socket.on('connect', () => {
        console.log('✅ Socket connected:', this.socket.id);
        // Join user's personal room
        if (userId) {
          this.socket.emit('join', userId);
        }
        
        // Attach any queued listeners
        this.listeners.forEach((callbacks, event) => {
          callbacks.forEach(callback => {
            this.socket.on(event, callback);
          });
        });
      });

      this.socket.on('disconnect', (reason) => {
        console.log('❌ Socket disconnected:', reason);
        // Don't attempt to reconnect if intentionally closed
        if (reason === 'io server disconnect' || reason === 'io client disconnect') {
          this.socket = null;
        }
      });

      this.socket.on('connect_error', (error) => {
        this.connectionAttempted = true;
        // Show warning only once per session
        if (!hasShownSocketWarning) {
          console.info('ℹ️ Real-time notifications unavailable (continuing without Socket.IO)');
          hasShownSocketWarning = true;
        }
        // Prevent connection spam - immediately close and clean up
        if (this.socket?.io?.engine) {
          this.socket.io.engine.close();
        }
        // Disable future reconnection attempts
        if (this.socket) {
          this.socket.io.reconnection(false);
        }
        this.disconnect();
      });

      this.socket.on('reconnect_failed', () => {
        this.connectionAttempted = true;
        if (!hasShownSocketWarning) {
          console.info('ℹ️ Real-time notifications disabled');
          hasShownSocketWarning = true;
        }
        this.disconnect();
      });
      
      this.socket.on('error', (error) => {
        // Suppress verbose socket errors completely - no logging
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
        hasShownSocketWarning = false; // Reset on successful reconnect
        // Rejoin user room after reconnection
        if (userId) {
          this.socket.emit('join', userId);
        }
      });
    } catch (error) {
      if (!hasShownSocketWarning) {
        console.info('ℹ️ Real-time features unavailable:', error.message);
        hasShownSocketWarning = true;
      }
    }
  }

  disconnect() {
    try {
      if (this.socket) {
        this.socket.removeAllListeners();
        this.socket.disconnect();
        this.socket = null;
        this.listeners.clear();
        // Don't log routine disconnections
      }
    } catch (error) {
      // Silent cleanup on error
      this.socket = null;
      this.listeners.clear();
    }
  }

  // Subscribe to notification events
  on(event, callback) {
    if (!this.socket || !this.socket.connected) {
      // Silently queue the listener for when socket connects
      if (!this.listeners.has(event)) {
        this.listeners.set(event, []);
      }
      this.listeners.get(event).push(callback);
      return;
    }

    this.socket.on(event, callback);
    
    // Store listener for cleanup
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  // Unsubscribe from events
  off(event, callback) {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(event, callback);
      
      // Remove from listeners map
      const callbacks = this.listeners.get(event) || [];
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      // Remove all listeners for this event
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }

  // Emit events to server
  emit(event, data) {
    if (!this.socket) {
      console.warn('Socket not connected. Call connect() first.');
      return;
    }
    this.socket.emit(event, data);
  }

  // Check connection status
  isConnected() {
    return this.socket?.connected || false;
  }
}

// Export singleton instance
const socketService = new SocketService();
export default socketService;

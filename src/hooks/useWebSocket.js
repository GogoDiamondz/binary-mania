import { useCallback, useEffect, useRef, useState } from 'react';

export function useWebSocket(userName) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userName) return;

    // Determine WebSocket protocol based on current page protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname;
    
    // Determine port based on environment
    let port = '';
    if (host === 'localhost' || host === '127.0.0.1') {
      // Dev environment: connect to port 4000
      port = ':4000';
    } else if (window.location.port && window.location.port !== '80' && window.location.port !== '443') {
      // Production/LAN with non-standard port: use same port as page
      port = `:${window.location.port}`;
    }
    // Otherwise no port (production with reverse proxy on standard ports)
    
    const wsUrl = `${protocol}//${host}${port}`;
    console.log(`WebSocket URL: ${wsUrl}`);

    // Create WebSocket connection
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);

      // Register user with server
      socket.send(JSON.stringify({
        type: 'register',
        userName: userName
      }));
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
        setMessages(prev => [...prev, message]);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        const readyState = socketRef.current.readyState;
        console.log('WebSocket cleanup, readyState=', readyState);

        // Delay close one tick so any leave notifications can still send
        setTimeout(() => {
          if (socketRef.current && socketRef.current.readyState !== WebSocket.CLOSED) {
            socketRef.current.close();
          }
        }, 0);
      }
    };
  }, [userName]);

  // Function to send messages
  const sendMessage = useCallback((message) => {
    const socket = socketRef.current;
    const readyState = socket?.readyState;
    if (socket && readyState === WebSocket.OPEN) {
      console.log('WebSocket send:', message);
      socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket send failed, socket not open, readyState=', readyState, message);
    }
  }, []);

  // Clear messages (useful after processing)
  const clearMessages = () => {
    setMessages([]);
  };

  return {
    isConnected,
    messages,
    sendMessage,
    clearMessages
  };
}
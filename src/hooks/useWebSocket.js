import { useEffect, useRef, useState } from 'react';

export function useWebSocket(userName) {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!userName) return;

    // Create WebSocket connection
    const socket = new WebSocket('ws://localhost:4000');
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
      socket.close();
    };
  }, [userName]);

  // Function to send messages
  const sendMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  };

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
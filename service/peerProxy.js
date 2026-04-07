const { WebSocketServer, WebSocket } = require('ws');

function peerProxy(httpServer) {
  // Create a websocket object
  const socketServer = new WebSocketServer({ server: httpServer });

  // Track connected users: userName -> socket
  const userConnections = new Map();

  socketServer.on('connection', (socket) => {
    socket.isAlive = true;
    let userName = null;

    // Handle messages with targeted routing
    socket.on('message', function message(data) {
      try {
        const message = JSON.parse(data.toString());

        // Handle user registration
        if (message.type === 'register') {
          userName = message.userName;
          userConnections.set(userName, socket);
          console.log(`User ${userName} connected`);
          return;
        }

        // Route message based on target
        if (message.targetUser) {
          // Send to specific user
          const targetSocket = userConnections.get(message.targetUser);
          if (targetSocket && targetSocket.readyState === WebSocket.OPEN) {
            targetSocket.send(JSON.stringify(message));
          }
        } else if (message.broadcast) {
          // Broadcast to all except sender
          socketServer.clients.forEach((client) => {
            if (client !== socket && client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify(message));
            }
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    // Clean up when connection closes
    socket.on('close', () => {
      if (userName) {
        userConnections.delete(userName);
        console.log(`User ${userName} disconnected`);
      }
    });

    // Respond to pong messages by marking the connection alive
    socket.on('pong', () => {
      socket.isAlive = true;
    });
  });

  // Periodically send out a ping message to make sure clients are alive
  setInterval(() => {
    socketServer.clients.forEach(function each(client) {
      if (client.isAlive === false) {
        // Find and remove dead user from connections
        for (const [userName, socket] of userConnections.entries()) {
          if (socket === client) {
            userConnections.delete(userName);
            console.log(`Removed dead connection for user ${userName}`);
            break;
          }
        }
        return client.terminate();
      }

      client.isAlive = false;
      client.ping();
    });
  }, 10000);

  return { userConnections }; // Return for potential external access
}

module.exports = { peerProxy };

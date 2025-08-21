import WebSocket, { WebSocketServer } from 'ws';

/**
 * WebSocket server
 * Responsibilities:
 * - Maintain a registry of online users (userId -> WebSocket)
 * - Broadcast presence changes (ONLINE/OFFLINE)
 * - Forward direct messages to receiver
 * - Forward typing indicators to receiver
 */
const wss = new WebSocketServer({ port: 8080 });

// Map of userId -> WebSocket
const users = new Map<string, WebSocket>();
// Reverse map of WebSocket -> userId to handle disconnects
const socketsToUser = new Map<WebSocket, string>();

/**
 * Broadcast presence change to all connected clients
 */
const broadcastPresence = (payload: { userId: string; status: 'ONLINE' | 'OFFLINE' }) => {
    const message = JSON.stringify({
        type: 'presence',
        data: {
            ...payload,
            onlineUsers: Array.from(users.keys()),
        },
    });
    for (const client of wss.clients) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
};

wss.on('connection', (ws: WebSocket) => {
    console.log('a user is connected');

    ws.on('message', (event: any) => {
        let parsedData: any;
        try {
            const text = typeof event === 'string' ? event : event?.toString?.();
            parsedData = JSON.parse(text);
        } catch (e) {
            console.error('Invalid JSON from client');
            return;
        }

        switch (parsedData.type) {
            case 'getUsers': {
                const userId = parsedData.data;
                if (!userId) return;
                users.set(userId, ws);
                socketsToUser.set(ws, userId);
                console.log('users', Array.from(users.keys()));

                // Send initial online list back to the requester
                ws.send(
                    JSON.stringify({ type: 'getUsers', data: Array.from(users.keys()) })
                );
                // Broadcast presence ONLINE to everyone
                broadcastPresence({ userId, status: 'ONLINE' });
                break;
            }
            case 'message': {
                const { senderId, receiverId, content, conversationId } = parsedData.data || {};
                if (!receiverId) return;
                const receiver = users.get(receiverId);
                const sendMessage = {
                    type: 'message',
                    data: { senderId, content, conversationId },
                };
                receiver?.send(JSON.stringify(sendMessage));
                break;
            }
            case 'typing': {
                // Forward typing indicator to the intended receiver only
                const { senderId, receiverId, conversationId, typing } = parsedData.data || {};
                if (!receiverId) return;
                const receiver = users.get(receiverId);
                const sendTyping = {
                    type: 'typing',
                    data: { senderId, conversationId, typing: Boolean(typing) },
                };
                receiver?.send(JSON.stringify(sendTyping));
                break;
            }
            case 'getPresence': {
                ws.send(
                    JSON.stringify({
                        type: 'presence',
                        data: { onlineUsers: Array.from(users.keys()) },
                    })
                );
                break;
            }
            default:
                break;
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        const userId = socketsToUser.get(ws);
        if (userId) {
            users.delete(userId);
            socketsToUser.delete(ws);
            broadcastPresence({ userId, status: 'OFFLINE' });
        }
        console.log('users', Array.from(users.keys()));
    });
});

wss.on('error', (error) => {
    console.error('WebSocket server error:', error);
});

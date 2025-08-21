import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { config } from "../config/api.config";

/**
 * useWebSocket
 * Manages a single WebSocket connection for:
 * - user registration/presence
 * - receiving messages
 * - typing indicators
 * Exposes helpers to send data and emit typing events.
 */
export const useWebSocket = (
  onMessageCallback?: (data: any) => void,
  onNotificationCallback?: (data: any) => void
) => {
  const currConversation = useSelector(
    (state) => state.conversation.currConversation
  );

  const senderId = useSelector((state: RootState) => state.user.currUser?.id);
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [webSocketUsers, setWebSocketUser] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [typingState, setTypingState] = useState<{ [conversationId: string]: boolean }>({});

  const callbackRef = useRef({
    currConversation,
    onNotificationCallback,
    onMessageCallback,
  });

  useEffect(() => {
    callbackRef.current.currConversation = currConversation;
    callbackRef.current.onNotificationCallback = onNotificationCallback;
    callbackRef.current.onMessageCallback = onMessageCallback;
  }, [currConversation, onNotificationCallback, onMessageCallback]);

  useEffect(() => {
    // Delay connection until we have a valid senderId to register
    if (!senderId) return;

    console.log("Initializing WebSocket connection");

    ws.current = new WebSocket(`${config.WS_URL}`);

    ws.current.onopen = () => {
      console.log("Connected to the server");
      setConnected(true);
      // Register this client with its user id
      ws.current?.send(JSON.stringify({ type: "getUsers", data: senderId }));
      // Request initial presence snapshot
      ws.current?.send(JSON.stringify({ type: 'getPresence' }));
    };

    ws.current.onmessage = (event: any) => {
      try {
        const parsedData = JSON.parse(event.data);
        console.log("Received WebSocket message:", parsedData.type);

        if (parsedData.type === "getUsers") {
          setWebSocketUser(parsedData.data);
        } else if (parsedData.type === "presence") {
          // presence updates
          if (Array.isArray(parsedData.data?.onlineUsers)) {
            setOnlineUsers(parsedData.data.onlineUsers);
          }
        } else if (parsedData.type === "message") {
          const {
            currConversation,
            onNotificationCallback,
            onMessageCallback,
          } = callbackRef.current;
          console.log("currConversation", currConversation);
          if (!currConversation) {
            console.log("currConversation not found");
            onNotificationCallback?.(parsedData.data);
            return;
          }
          const isSenderInConversation = currConversation.members.some(
            (member) => member.user.id === parsedData.data.senderId
          );
          if (!isSenderInConversation) {
            onNotificationCallback?.(parsedData.data);
            return;
          }
          onMessageCallback?.(parsedData.data);
        } else if (parsedData.type === "typing") {
          const { senderId: typingSenderId, conversationId, typing } = parsedData.data || {};
          if (!conversationId) return;

          // Only set typing for the active conversation and when the sender belongs to it
          const { currConversation } = callbackRef.current;
          if (!currConversation) return;
          const isSenderInConversation = currConversation.members.some(
            (member: any) => member.user.id === typingSenderId
          );
          if (!isSenderInConversation) return;

          setTypingState((prev) => ({ ...prev, [conversationId]: Boolean(typing) }));
        }
      } catch (error) {
        console.error("Error processing WebSocket message:", error);
      }
    };

    ws.current.onclose = () => {
      console.log("Disconnected from the server");
      setConnected(false);
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnected(false);
    };

    return () => {
      console.log("Cleaning up WebSocket connection");
      ws.current?.close();
    };
  }, [senderId]);

  const sendFunc = (data: any) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not ready, message not sent");
      return;
    }
    console.log("Sending message:", data);
    ws.current.send(JSON.stringify(data));
  };

  /**
   * emitTyping
   * Sends a typing indicator to the receiver for a specific conversation
   */
  const emitTyping = (payload: { receiverId: string; conversationId: string; senderId?: string; typing: boolean }) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    ws.current.send(
      JSON.stringify({ type: 'typing', data: payload })
    );
  };

  return { ws: ws.current, connected, webSocketUsers, onlineUsers, typingState, sendFunc, emitTyping };
};

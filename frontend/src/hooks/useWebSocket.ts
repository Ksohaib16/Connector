import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

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
    console.log("Initializing WebSocket connection");

    ws.current = new WebSocket("ws://localhost:8080");

    ws.current.onopen = () => {
      console.log("Connected to the server");
      setConnected(true);
      const data = { type: "getUsers", data: senderId };
      ws.current?.send(JSON.stringify(data));
    };

    ws.current.onmessage = (event: any) => {
      try {
        const parsedData = JSON.parse(event.data);
        console.log("Received WebSocket message:", parsedData.type);

        if (parsedData.type === "getUsers") {
          setWebSocketUser(parsedData.data);
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
  }, []); // Dependency reduced to senderId only

  const sendFunc = (data: any) => {
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) {
      console.log("WebSocket not ready, message not sent");
      return;
    }
    console.log("Sending message:", data);
    ws.current.send(JSON.stringify(data));
  };

  return { ws: ws.current, connected, webSocketUsers, sendFunc };
};

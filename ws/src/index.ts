import WebSocket, { WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: Number(process.env.PORT ) });

let users = new Map<string, WebSocket>();

wss.on("connection", (ws: WebSocket) => {
  //connect
  console.log("a user is connected");

  ws.on("message", (event: any) => {
    const parsedData = JSON.parse(event);
    if (parsedData.type === "getUsers") {
      const userId = parsedData.data;
      users.set(userId, ws);
      console.log("users", Array.from(users.keys()));

      ws.send(
        JSON.stringify({ type: "getUsers", data: Array.from(users.keys()) })
      );
    } else if (parsedData.type === "message") {
      console.log(" 2 message", parsedData.data);
      const { senderId, receiverId, content, conversationId } = parsedData.data;
      const receiver = users.get(receiverId);
      const sendMessage = {
        type: "message",
        data: { senderId, content, conversationId },
      };
      receiver?.send(JSON.stringify(sendMessage));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
    let userIdRemove: string | null = null;
    for (const [userId, value] of users.entries()) {
      if (value === ws) {
        userIdRemove = userId;
        break;
      }
    }

    if (userIdRemove) {
      users.delete(userIdRemove);
    }
    console.log("users", Array.from(users.keys()));
  });
});

wss.on("error", (error) => {
  console.error("WebSocket server error:", error);
});

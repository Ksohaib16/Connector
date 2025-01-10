// import { useSelector } from "react-redux";
// import { Message } from "./Message";
// import "./messages.css";
// import { useEffect,useState } from "react";
// import axios from "axios";
// import { getAuth } from "firebase/auth";
// const auth = getAuth();

// export const Messages = () => {
//   const [messages, setMessages] = useState([]);
//   const currConversationId = useSelector(
//     (state) => state.conversation.currConversation
//   );

//   useEffect(() => {
//     const getAllMessages = async () => {
//       const token = await auth.currentUser?.getIdToken();
//       const response = await axios.get(
//         `http://localhost:3000/api/v1/user/messages/${currConversationId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       console.log("response data ", response.data.data.messages);
//       setMessages(response.data.data.messages);
//     };
//     getAllMessages();
//   }, [currConversationId]);

//   return (
//     <div className="messages">
//       {messages.map((message) => (
//         <Message key={message.id} message={message} />
//       ))}
//     </div>
//   );
// };

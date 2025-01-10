// import { SendHorizontal, Sparkles } from "lucide-react";
// import "./messageInput.css";
// import { useState } from "react";

// type Props = { handleSend: (message: string) => void;}

// export const MessageInput : React.FC<Props> = ({ handleSend }) => {
//   const [content, setContent] = useState("");

//   return (
//     <div className="message-input">
//       <div className="input-box">
//         <input
//           type="text"
//           placeholder="Type a message..."
//           value={content}
//           onChange={(e) => {
//             setContent(e.target.value);
//           }}
//         />
//         <Sparkles color="#AAAAAA" strokeWidth={1.5} />
//       </div>
//       <button className="send-btn" onClick={() => handleSend(content)}>
//         <SendHorizontal color="#3874c9" size={30} strokeWidth={2} />
//       </button>
//     </div>
//   );
// };

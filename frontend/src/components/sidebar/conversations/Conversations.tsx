// import "./conversations.css";

// import { Conversation } from "./Conversation";
// import { useDispatch } from "react-redux";
// import { setCurrConversation } from "../../../redux/conversationSlice";
// import { Loader } from "../../loader/Loader";

// export const Conversations = ({ conversations }: any) => {
//   const dispatch = useDispatch();

//   if (!conversations || conversations.length === 0) {
//     return (
//       <div className="flex items-center justify-center align-middle  w-full h-full text-[var(--primary)]">
//         <Loader size={5} />
//       </div>
//     );
//   }

//   const handleSelectConversation = async (conversation, frndUser) => {
//     dispatch(setCurrConversation({ conversation, frndUser }));
//     console.log(conversation, frndUser);
//   };

//   return (
//     <div className="conversations">
//       {conversations.length > 0 ? (
//         conversations.map((conversation) => (
//           <Conversation
//             // className={`conversation ${conversation.id ====  ? "alert" : ""}`}
//             key={conversation.id}
//             conversation={conversation}
//             onSelectConversation={handleSelectConversation}
//           />
//         ))
//       ) : (
//         <Loader />
//       )}
//     </div>
//   );
// };

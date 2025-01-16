import "./home.css";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Chat } from "../components/chat/Chat";
import { setCurrConversation } from "../redux/conversationSlice";

export const Home: React.FC = () => {
  const dispatch = useDispatch();
  const isMobile = window.matchMedia("(max-width: 768px)").matches
  const currConversation = useSelector((state: RootState) => state.conversation.currConversation);
  const handleCurrConversation = () => {
    dispatch(setCurrConversation({ currConversation: null, frndUser: null }));
  };
  return (
    <div className="home-container">
      {isMobile ? (
        <>
          {currConversation ? <Chat handleCurrConversation={handleCurrConversation} /> : <Sidebar />}
        </>
      ) : (
        <>
          <Sidebar />
          <Chat handleCurrConversation={handleCurrConversation} />
        </>
      )}
    </div>
  );
};

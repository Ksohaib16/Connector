// Home.tsx  (drop-in replacement, logic unchanged)
import "./home.css";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Sidebar } from "../components/sidebar/Sidebar";
import { Chat } from "../components/chat/Chat";
import { setCurrConversation } from "../redux/conversationSlice";
import { getAuth } from "firebase/auth";
import { config } from "../config/api.config";

export const Home: React.FC = () => {
  const dispatch = useDispatch();
  const currConversation = useSelector(
    (state: RootState) => state.conversation.currConversation
  );

  const handleCurrConversation = () => {
    dispatch(setCurrConversation({ currConversation: null, frndUser: null }));
  };

  // Set OFFLINE presence on unload
  useEffect(() => {
    const auth = getAuth();
    const onBeforeUnload = async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        if (!token) return;
        navigator.sendBeacon?.(
          `${config.API_URL}/api/v1/presence`,
          new Blob([JSON.stringify({ status: "OFFLINE" })], {
            type: "application/json",
          })
        );
      } catch {
        // ignore
      }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, []);

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
      {/* Sidebar always renders; chat shows on md+ or when conversation exists */}
      <div
        className={`w-full md:w-[300px] lg:w-[320px] shrink-0 border-r border-white/10
                    ${currConversation ? "hidden md:flex" : "flex"}`}
      >
        <Sidebar />
      </div>

      {/* Chat area */}
      <div
        className={`flex-1 ${!currConversation ? "hidden md:flex" : "flex"}`}
      >
        <Chat handleCurrConversation={handleCurrConversation} />
      </div>
    </div>
  );
};

import "./chat.css";
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ArrowLeft,
  Eraser,
  Languages,
  LetterText,
  SendHorizontal,
  ShieldBan,
  Sparkles,
  Trash2,
  UserPen,
} from "lucide-react";
import { ConversationImage } from "../shared/ConversationImage";
import { ConversationTitle } from "../shared/ConversationTitle";
import { KebabMenu } from "../shared/KebabMenu";
import { Message } from "./Message";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { RootState } from "../../redux/store";
import {
  addNotification,
  updateConversation,
} from "../../redux/conversationSlice";
import { useWebSocket } from "../../hooks/useWebSocket";
import { ModalWrapper } from "../wrapper/ModalWrapper";
import { ModalOption } from "../shared/ModalOption";
import { TranslationSettingModal } from "../modal/TranslationSettingModal";
import { setTranslationSetting } from "../../redux/llmSlice";

const auth = getAuth();

export const Chat = ({handleCurrConversation}: {handleCurrConversation: () => void}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const frndUser = useSelector(
    (state: RootState) => state.conversation.frndUser
  );
  const frndName = frndUser?.user?.username;
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const currConversation = useSelector(
    (state: RootState) => state.conversation.currConversation
  );
  console.log("current conversation", currConversation);
  const currConversationId = currConversation?.id;
  const translationSetting = useSelector(
    (state: RootState) =>
      state.translator.translationSetting[currConversationId || ""]
  );
  const notification = useSelector(
    (state) => state.conversation.notificationCount[currConversationId || ""]
  );
  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [showConversationSetting, setShowConversationSetting] = useState(false);
  const [showAI, setShowAI] = useState(false);

  const senderId = useSelector((state: RootState) => state.user.currUser?.id);

  const handleWebSocketMessage = useCallback(
    (data: any) => {
      if (data) {
        console.log("ws conversiaotn id ", data.conversationId);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            ...data,
            id: `ws-${Date.now()}`,
            createdAt: new Date(),
          },
        ]);
      }
    },
    [currConversation?.id, currConversation?.members]
  );

  const handleNotification = useCallback((data: any) => {
    console.log("New Notification Received:", data);

    const { conversationId, senderId, content } = data;

    console.log(`Notification Details:`);
    console.log(`Conversation ID: ${conversationId}`);
    console.log(`Sender ID: ${senderId}`);
    console.log(`Content: ${content}`);

    dispatch(addNotification({ conversationId, count: 1 }));
  }, []);

  const { sendFunc } = useWebSocket(handleWebSocketMessage, handleNotification);
  useEffect(() => {
    const getAllMessages = async () => {
      if (!currConversation?.id) return;
      const token = await auth.currentUser?.getIdToken();
      const response = await axios.get(
        `http://localhost:3000/api/v1/user/messages/${currConversation.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessages(response.data.data.messages);
    };
    getAllMessages();
  }, [currConversation.id]);

  const handleSend = async (content: any) => {
    const token = await auth.currentUser?.getIdToken();
    const receiverId = frndUser?.user?.id;
    const websocketData = {
      type: "message",
      data: {
        senderId,
        receiverId,
        content,
        conversationId: currConversation?.id,
      },
    };
    sendFunc(websocketData);

    const response = await axios.post(
      "http://localhost:3000/api/v1/user/messages",
      {
        content,
        conversationId: currConversation?.id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setMessages((prev) => [...prev, response.data.data.newMessage]);

    console.log(
      "responsefrom conversation api ",
      response.data.data.updatedConversation
    );
    dispatch(updateConversation(response.data.data.updatedConversation));
    console.log("translationSetting", translationSetting);
    console.log("notifacaiton", notification);
    setContent("");
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTranslationModal = async () => {
    console.log("clicked");
    setShowAI(!showAI);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/translate/inputtext",
        {
          text: content,
          from: `${translationSetting?.from}`,
          to: `${translationSetting?.to}`,
        }
      );
      console.log(response.data.data.translation);
      setContent(response.data.data.translation);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLanguage = () => {
    console.log("clicked");
    setShowTranslationModal(!false);
  };

  const handleTranslationModalSetting = (conversationId, from, to) => {
    console.log("clicked");
    console.log(`conversationId ${conversationId} - from ${from} - to ${to}`);
    setShowTranslationModal(false);
    dispatch(setTranslationSetting({ conversationId, from, to }));
  };

  return (
    <div className="chat">
      {showTranslationModal && (
        <TranslationSettingModal handleClick={handleTranslationModalSetting} />
      )}
      {showConversationSetting && (
      <div className="conversation-setting">
          <ModalWrapper>
            <ModalOption icon={UserPen} option={"Profile"} />
            <ModalOption icon={Eraser} option={"Clear Chat"} />
            <ModalOption
              handleClick={handleLanguage}
              icon={Languages}
              option={"Language Settings"}
            />
            <ModalOption
              handleClick={handleTranslationModal}
              icon={ShieldBan}
              option={"Block Friend"}
            />
            <ModalOption
              handleClick={handleTranslationModal}
              icon={Trash2}
              option={"Delete Conversation"}
              className="danger"
            />
          </ModalWrapper>
        </div>
      )}
      <div className="chat-navbar">
        <button onClick={handleCurrConversation}>
          <ArrowLeft size={30} color="#ffffff" strokeWidth={1.5} />
        </button>
        <ConversationImage />
        <div className="chat-info">
          <div className="conversation-title">
            <ConversationTitle name={frndName} />
          </div>
          <div className="chat-status">Online</div>
        </div>
        <button onClick={e => setShowConversationSetting(!showConversationSetting)}>
          <KebabMenu />
        </button>
      </div>
      <div className="messages">
        {messages.map((message, index) => (
          <div
            key={message.id}
            ref={index === messages.length - 1 ? scrollRef : null}
          >
            <Message message={message} />
          </div>
        ))}
      </div>
      <div className="message-input">
        <div className="input-box">
          <input
            type="text"
            placeholder="Type a message..."
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
          <Sparkles
            color="#AAAAAA"
            strokeWidth={1.5}
            cursor="pointer"
            onClick={e => setShowAI(!showAI)}
          />
        </div>
        <button className="send-btn" onClick={() => handleSend(content)}>
          <SendHorizontal className="send-btn-icon"  size={30} strokeWidth={2} />
        </button>
      </div>
      {showAI && <div className="AI-modal">
        <ModalWrapper>
          <ModalOption
            handleClick={handleTranslationModal}
            icon={Languages}
            option={"Translate"}
          />
          <ModalOption icon={LetterText} option={"Format"} />
        </ModalWrapper>
      </div>}
    </div>
  );
};

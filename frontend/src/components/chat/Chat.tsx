import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getAuth } from 'firebase/auth';
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
} from 'lucide-react';
import { ConversationImage } from '../shared/ConversationImage';
import { ConversationTitle } from '../shared/ConversationTitle';
import { KebabMenu } from '../shared/KebabMenu';
import { Message } from './Message';
import { ModalWrapper } from '../wrapper/ModalWrapper';
import { ModalOption } from '../shared/ModalOption';
import { TranslationSettingModal } from '../modal/TranslationSettingModal';
import { addNotification, updateConversation } from '../../redux/conversationSlice';
import { setTranslationSetting } from '../../redux/llmSlice';
import { RootState } from '../../redux/store';
import { Loader } from '../loader/Loader';
import { config } from '../../config/api.config';
import { useWebSocket } from '../../hooks/useWebSocket';


const auth = getAuth();

interface MemberUser { id: string; username?: string; avatarUrl?: string }
interface ConversationShape { id: string; members: Array<{ user: MemberUser }> }
interface FriendShape { user: MemberUser }
interface MessageShape { id: string | number; senderId: string; content: string; createdAt: string | Date }
interface UserShape { id: string; username?: string; avatarUrl?: string }

export const Chat = ({ handleCurrConversation }: { handleCurrConversation: () => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const frndUser = useSelector((s: RootState) => s.conversation.frndUser) as FriendShape | null;
  const currConversation = useSelector((s: RootState) => s.conversation.currConversation) as ConversationShape | null;
  const currUser = useSelector((s: RootState) => s.user.currUser) as UserShape | null;
  const senderId = currUser?.id;

  const [messages, setMessages] = useState<MessageShape[]>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const currConversationId: string | undefined = currConversation?.id as string | undefined;
  const translationSetting = useSelector(
    (s: RootState) => s.translator.translationSetting[currConversationId || '']
  );

  const [showTranslationModal, setShowTranslationModal] = useState(false);
  const [showConversationSetting, setShowConversationSetting] = useState(false);
  const [showAI, setShowAI] = useState(false);

  /* ---------------- web-socket handlers ---------------- */
  // onMessageCallback: append real-time message to the thread
  const handleWsMessage = useCallback(
    (data: MessageShape) => {
      if (data) {
        setMessages((prev: MessageShape[]) => [
          ...prev,
          { ...data, id: `ws-${Date.now()}`, createdAt: new Date() },
        ]);
      }
    },
    []
  );
  // onNotificationCallback: increment per-conversation notification when not viewing thread
  const handleNotification = useCallback(
    (data: { conversationId: string }) => {
      dispatch(addNotification({ conversationId: data.conversationId, count: 1 }));
    },
    [dispatch]
  );
  const { sendFunc, emitTyping, onlineUsers, typingState } = useWebSocket(handleWsMessage, handleNotification);

  /* ---------------- fetch messages ---------------- */
  useEffect(() => {
    if (!currConversationId) return;
    (async () => {
      const token = await auth.currentUser?.getIdToken();
      const { data } = await axios.get(
        `${config.API_URL}/api/v1/user/messages/${currConversationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(data.data.messages);
    })();
  }, [currConversationId]);

  /* ---------------- typing indicator ---------------- */
  // Emit typing on input change and stop typing when empty or after delay
  useEffect(() => {
    if (!frndUser?.user?.id || !currConversationId || !senderId) return;
    const isTyping = Boolean(content.trim());
    emitTyping({ receiverId: frndUser.user.id, conversationId: currConversationId, senderId, typing: isTyping });
    if (!isTyping) return;
    const timeout = setTimeout(() => {
      emitTyping({ receiverId: frndUser.user.id, conversationId: currConversationId, senderId, typing: false });
    }, 1500);
    return () => clearTimeout(timeout);
  }, [content, frndUser?.user?.id, currConversationId, senderId, emitTyping]);

  /* ---------------- send message ---------------- */
  const handleSend = async () => {
    if (!content.trim()) return;
    const token = await auth.currentUser?.getIdToken();
    const receiverId = frndUser?.user?.id as string | undefined;
    setIsLoading(true);

    // websocket
    sendFunc({
      type: 'message',
      data: { senderId, receiverId, content, conversationId: currConversationId },
    });

    try {
      const { data } = await axios.post(
        `${config.API_URL}/api/v1/user/messages`,
        { content, conversationId: currConversationId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev: MessageShape[]) => [...prev, data.data.newMessage as MessageShape]);
      dispatch(updateConversation(data.data.updatedConversation));
      setContent('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------- auto-scroll ---------------- */
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /* ---------------- translation helpers ---------------- */
  const handleInputTranslate = async () => {
    if (!translationSetting?.from || !translationSetting?.to) return;
    setIsTranslating(true);
    try {
      const { data } = await axios.post(
        `${config.API_URL}/api/v1/translate/inputtext`,
        { text: content, from: translationSetting.from, to: translationSetting.to }
      );
      setContent(data.data.translation);
    } finally {
      setIsTranslating(false);
    }
  };

  const resetTranslation = useCallback(() => {
    if (!currConversationId) return;
    dispatch(
      setTranslationSetting({
        conversationId: currConversationId,
        from: 'English',
        to: 'English',
      })
    );
  }, [currConversationId, dispatch]);

  useEffect(() => {
    if (!currConversationId) return;
    const invalid =
      !translationSetting ||
      translationSetting.from === 'Auto-Detect' ||
      translationSetting.from === 'undefined' ||
      translationSetting.to === 'undefined';
    if (invalid) resetTranslation();
  }, [currConversationId, translationSetting, resetTranslation]);

  if (!currConversation) {
    return (
      <div className="flex items-center justify-center h-full text-2xl font-semibold text-gray-400">
        Select a conversation to start
      </div>
    );
  }

  return (
    <section className="flex flex-col h-full w-full bg-slate-900 text-white">
      {/* Header */}
      <header className="flex items-center gap-3 px-3 py-2 border-b border-slate-700">
        <button
          className="p-1 rounded-md hover:bg-slate-700 md:hidden"
          onClick={handleCurrConversation}
        >
          <ArrowLeft size={24} />
        </button>

        <ConversationImage frndImg={frndUser?.user?.avatarUrl} />
        <div className="flex-1">
          <ConversationTitle name={frndUser?.user?.username || ''} />
          {frndUser?.user?.id && onlineUsers.includes(frndUser.user.id) ? (
            <span className="text-xs text-green-400">Online</span>
          ) : (
            <span className="text-xs text-gray-400">Offline</span>
          )}
          {currConversationId && typingState[currConversationId] && (
            <span className="ml-2 text-xs text-blue-400">typing…</span>
          )}
        </div>

        <button
          className="p-1 rounded-md hover:bg-slate-700"
          onClick={() => setShowConversationSetting(true)}
        >
          <KebabMenu />
        </button>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-3 py-2 space-y-2">
        {messages.map((m: MessageShape) => (
          <Message key={m.id} message={m} />
        ))}
        <div ref={scrollRef} />
      </main>

      {/* Input */}
      <footer className="flex items-center gap-2 px-3 py-2 border-t border-slate-700">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-full bg-slate-800 text-sm focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />

        <div className="flex items-center gap-2">
          {isTranslating ? (
            <Loader size={20} />
          ) : (
            <Sparkles
              className="cursor-pointer text-gray-400 hover:text-white"
              onClick={() => setShowAI(!showAI)}
            />
          )}
          <button
            disabled={isLoading}
            onClick={handleSend}
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? <Loader size={20} /> : <SendHorizontal size={20} />}
          </button>
        </div>
      </footer>

      {/* Modals */}
      {showTranslationModal && (
        <ModalWrapper onClose={() => setShowTranslationModal(false)}>
          <TranslationSettingModal
            handleClick={resetTranslation}
            onClose={() => setShowTranslationModal(false)}
          />
        </ModalWrapper>
      )}
      {showConversationSetting && (
        <ModalWrapper onClose={() => setShowConversationSetting(false)}>
          <ModalOption icon={UserPen} option="Profile" />
          <ModalOption icon={Eraser} option="Clear Chat" />
          <ModalOption icon={Languages} option="Language Settings" handleClick={() => {
            setShowConversationSetting(false);
            setShowTranslationModal(true);
          }} />
          <ModalOption icon={ShieldBan} option="Block Friend" />
          <ModalOption icon={Trash2} option="Delete Conversation" className="danger" />
        </ModalWrapper>
      )}
      {showAI && (
        <ModalWrapper onClose={() => setShowAI(false)}>
          <ModalOption icon={Languages} option="Translate" handleClick={handleInputTranslate} />
          <ModalOption icon={LetterText} option="Format" />
        </ModalWrapper>
      )}
    </section>
  );
};

import { useState, useEffect, FC } from 'react';
import { LogOut, Menu, SunMoon, ToggleRight, UserPen } from 'lucide-react';
import axios from 'axios';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addConversation,
  setConversations,
  setCurrConversation,
} from '../../redux/conversationSlice';
import { setUser } from '../../redux/userSlice';
import { RootState } from '../../redux/store';
import { Conversation } from './conversations/Conversation';
import { Loader } from '../loader/Loader';
import { AddFriendModal } from '../modal/AddFriend';
import { SearchBox } from './navbar/SearchBox';
import { ModalWrapper } from '../wrapper/ModalWrapper';
import { ModalOption } from '../shared/ModalOption';
import { config } from '../../config/api.config';
import { Portal } from '../shared/Portal';

const auth = getAuth();

type ConversationItem = { id: string } & Record<string, unknown>;
type FriendItem = Record<string, unknown>;

export const Sidebar: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [friend, setFriend] = useState({
    username: '',
    email: '',
    id: '',
    avatarUrl: '',
  });

  const [friendModal, setFriendModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const conversations = useSelector(
    (state: RootState) => state.conversation.conversations
  );

  /* ---------------- fetch conversations ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        dispatch(setConversations(null));
        return;
      }
      try {
        setIsLoading(true);
        const token = await user.getIdToken();
        const { data } = await axios.get(
          `${config.API_URL}/api/v1/user/conversations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        dispatch(setConversations(data.data.userConversation));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    });
    return unsub;
  }, [dispatch]);

  /* ---------------- handlers ---------------- */
  const handleSearch = async (search: string) => {
    if (!search.trim()) return;
    const token = await auth.currentUser?.getIdToken();
    const { data } = await axios.post(
      `${config.API_URL}/api/v1/user/friend`,
      { email: search },
      { headers: { Authorization: `Bearer ${token }` } }
    );
    setFriend(data.data.friend);
    setFriendModal(true);
  };

  const handleAdd = async () => {
    const token = await auth.currentUser?.getIdToken();
    const { data } = await axios.post(
      `${config.API_URL}/api/v1/user/addFriend`,
      { email: friend.email, id: friend.id },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(addConversation(data.data.newConversation));
    setFriendModal(false);
  };

  const handleLogout = () => {
    auth.signOut();
    dispatch(setUser(null));
    navigate('/login');
  };

  return (
    <aside className="flex flex-col h-full bg-slate-900 border-r border-slate-700">
      {/* Navbar */}
      <header className="flex items-center gap-3 px-3 py-2 border-b border-slate-700">
        <button
          className="p-2 rounded-md hover:bg-slate-700"
          onClick={() => setShowProfileModal(true)}
        >
          <Menu className="w-6 h-6 text-gray-400" />
        </button>
        <SearchBox handleSearch={handleSearch} />
      </header>

      {/* Conversations */}
      <section className="flex-1 overflow-y-auto p-2 space-y-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader size={20} />
          </div>
        ) : (
          conversations?.map((c: ConversationItem) => (
            <Conversation
              key={c.id}
              conversation={c}
              onSelectConversation={(conv: ConversationItem, frnd: FriendItem) =>
                dispatch(setCurrConversation({ conversation: conv, frndUser: frnd }))
              }
            />
          ))
        )}
      </section>

      {/* Profile Modal */}
{showProfileModal && (
  <Portal>
    <ModalWrapper onClose={() => setShowProfileModal(false)}>
      <ModalOption icon={UserPen} option="My Profile" />
      <ModalOption icon={SunMoon} option="Dark Mode" switch={ToggleRight} />
      <ModalOption
        icon={LogOut}
        option="Logout"
        className="danger"
        handleClick={handleLogout}
      />
    </ModalWrapper>
  </Portal>
)}

{friendModal && (
  <Portal>
    <ModalWrapper onClose={() => setFriendModal(false)}>
      <AddFriendModal
        name={friend.username}
        email={friend.email}
        avatarUrl={friend.avatarUrl}
        handleAdd={handleAdd}
      />
    </ModalWrapper>
  </Portal>
)}
    </aside>
  );
};

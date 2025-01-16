import "./sidebar.css";
import "./navbar/navbar.css";
import "./conversations/conversation.css";
import { ModalWrapper } from "../wrapper/ModalWrapper";
import { ModalOption } from "../shared/ModalOption";
import { useState, useEffect } from "react";
import {
  LogOut,
  Menu,
  SunMoon,
  ToggleRight,
  UserPen,
} from "lucide-react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();

import { AddFriendModal } from "../modal/AddFriend";
import { SearchBox } from "./navbar/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversation,
  setConversations,
  setCurrConversation,
} from "../../redux/conversationSlice";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/userSlice";
import { RootState } from "../../redux/store";
import { Conversation } from "./conversations/Conversation";
import { Loader } from "../loader/Loader";
import { config } from "../../config/api.config";

export const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [friend, setFriend] = useState({
    username: "",
    email: "",
    id: "",
    avatarUrl: "",
  });

  const [friendModal, setFriendModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const conversations = useSelector(
    (state: RootState) => state.conversation.conversations
  );
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          setIsLoading(true);
          const token = await user.getIdToken();
          const response = await axios.get(
            `${config.API_URL}/user/conversations`,            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(response.data.data.userConversation);
          dispatch(setConversations(response.data.data.userConversation));
        } catch (error) {
          console.error("Error fetching conversations:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("No user is signed in");
        dispatch(setConversations(null));
      }
    });

    return () => unsubscribe();
  }, []);

  const name = friend.username;
  const email = friend.email;
  const id = friend.id;
  const avatarUrl = friend.avatarUrl;

  const handleSearch = async (search: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();

      const response = await axios.post(
        `${config.API_URL}/user/friend`,
        {
          email: search,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFriend(response.data.data.friend);
      setFriendModal(!false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    console.log("button clicked");
    try {
      const token = await auth.currentUser?.getIdToken();

      const response = await axios.post(
        `${config.API_URL}/user/addFriend`,
        {
          email: email,
          id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newConversation = response.data.data.newConversation;
      if (!newConversation || !newConversation.id || !newConversation.members) {
        throw new Error("Invalid conversation structure");
      }
      dispatch(addConversation(response.data.data.newConversation));
    } catch (error) {
      console.error("Error adding conversation:", error);
    }
    setFriendModal(false);
  };

  const handleSelectConversation = async (conversation, frndUser) => {
    dispatch(setCurrConversation({ conversation, frndUser }));
    console.log(conversation, frndUser);
  };

  const handleLogout = () => {
    auth.signOut();
    dispatch(setUser(null));
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="navbar">
        <div
          className="menu-btn"
          onClick={() => setShowProfileModal(!showProfileModal)}
        >
          <Menu
            style={{ cursor: "pointer" }}
            color="#AAAAAA"
            size={35}
            strokeWidth={1.5}
          />
        </div>
        <SearchBox handleSearch={handleSearch} />
      </div>
      {isLoading ? (
        <div className="isLoading">
          <Loader size={20} />
        </div>
      ) : (
        <div className="conversations">
          {friendModal && (
            <AddFriendModal
              name={name}
              email={email}
              avatarUrl={avatarUrl}
              handleAdd={handleAdd}
            />
          )}
          {conversations.map((conversation) => (
            <Conversation
              key={conversation.id}
              conversation={conversation}
              onSelectConversation={handleSelectConversation}
            />
          ))}
        </div>
      )}
      {showProfileModal && (
        <div className="profile-modal">
          <ModalWrapper>
            <ModalOption icon={UserPen} option={"My Profile"} />
            <ModalOption
              icon={SunMoon}
              option={"Dark Mode"}
              switch={ToggleRight}
            />
            <ModalOption
              handleClick={handleLogout}
              icon={LogOut}
              option={"Logout"}
              className={"danger"}
            />
          </ModalWrapper>
        </div>
      )}
    </div>
  );
};

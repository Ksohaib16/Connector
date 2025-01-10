import "./sidebar.css";
import "./navbar/navbar.css";
import { Conversations } from "./conversations/Conversations";
import { ModalWrapper } from "../wrapper/ModalWrapper";
import { ModalOption } from "../shared/ModalOption";
import { useState, useEffect } from "react";
import { LogOut, Menu, SunMoon, ToggleRight, UserPen } from "lucide-react";
import axios from "axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
const auth = getAuth();

import { AddFriendModal } from "../modal/AddFriend";
import { SearchBox } from "./navbar/SearchBox";
import { useDispatch, useSelector } from "react-redux";
import {
  addConversation,
  setConversations,
} from "../../redux/conversationSlice";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/userSlice";

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
  const conversations = useSelector(
    (state) => state.conversation.conversations
  );
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          const response = await axios.get(
            "http://localhost:3000/api/v1/user/conversations",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          dispatch(setConversations(response.data.data.userConversation));
        } catch (error) {
          console.error("Error fetching conversations:", error);
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
  console.log(friend);

  const handleSearch = async (search: string) => {
    try {
      const token = await auth.currentUser?.getIdToken();

      const response = await axios.post(
        "http://localhost:3000/api/v1/user/friend",
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
        "http://localhost:3000/api/v1/user/add",
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

  if (!conversations) {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    auth.signOut();
    dispatch(setUser(null))
    navigate("/login");
  }

  return (
    <div className="sidebar">
      <div className="navbar">
        <div className="menu-btn" onClick={() => setShowProfileModal(!showProfileModal)}>
          <Menu
            style={{ cursor: "pointer" }}
            color="#AAAAAA"
            size={35}
            strokeWidth={1.5}
          />
        </div>
        <SearchBox handleSearch={handleSearch} />
      </div>
      <div className="conversations">
        {friendModal && (
          <AddFriendModal
            name={name}
            email={email}
            avatarUrl={avatarUrl}
            handleAdd={handleAdd}
          />
        )}
        <Conversations conversations={conversations} />
      </div>
      {showProfileModal && (
        <div className="profile-modal">
          <ModalWrapper>
            <ModalOption icon={UserPen} option={"My Profile"} />
            <ModalOption
              icon={SunMoon}
              option={"Dark Mode"}
              switch={ToggleRight}
            />
            <ModalOption handleClick={handleLogout} icon={LogOut} option={"Logout"} className={"danger"} />
          </ModalWrapper>
        </div>
      )}
    </div>
  );
};

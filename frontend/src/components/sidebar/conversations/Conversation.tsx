import { useSelector } from "react-redux";
import { ConversationImage } from "../../shared/ConversationImage";
import { ConversationTitle } from "../../shared/ConversationTitle";
import "./conversation.css";
import { format, isThisWeek, isToday, isYesterday } from "date-fns";

const dateFormater = (date) => {
  if (isToday(date)) {
    return `${format(date, "HH: MM a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday ${format(date, "HH: MM a")}`;
  } else if (isThisWeek(date)) {
    return `${format(date, "EEEE HH: MM a")}`;
  } else {
    return `${format(date, "dd/MM/yyyy HH: MM a")}`;
  }
};

export const Conversation = ({ conversation, onSelectConversation }) => {
  
  if (!conversation || !conversation.members) {
    return <div>No conversation found</div>;
  }

  const currUser = useSelector((state) => state.user.currUser);
  const currUserId = currUser.id;

  const frndUser = conversation.members.find(
    (member) => member.userId !== currUserId
  );

  if (!frndUser) {
    return <div>No friend found</div>;
  }

  const frndName = frndUser.user.username;
  return (
    <div
      className="conversation"
      onClick={() => {
        onSelectConversation(conversation, frndUser);
      }}
    >
      <div className="conversation-img">
        <ConversationImage />
      </div>
      <div className="conversation-info-container">
        <div className="conversation-info">
          <div className="conversation-title-container">
            <ConversationTitle name={frndName} />
          </div>
          <div className="conversation-last-msg">
            {conversation.lastMessageContent}
          </div>
        </div>
        <div className="msg-info">
          <div className="last-msg-time">
            {dateFormater(conversation.lastMessageTime)}
          </div>
          {conversation.notification > 0 && (
            <div className="new-msg-notification">{conversation.notification}</div>
          )}
        </div>
      </div>
    </div>
  );
};

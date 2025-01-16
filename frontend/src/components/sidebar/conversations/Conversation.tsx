import { useSelector } from "react-redux";
import { ConversationImage } from "../../shared/ConversationImage";
import { ConversationTitle } from "../../shared/ConversationTitle";
import "./conversation.css";
import { format, isThisWeek, isToday, isYesterday } from "date-fns";
import { RootState } from "../../../redux/store";

const dateFormater = (date: string) => {
  if (isToday(date)) {
    return `${format(date, "HH: MM a")}`;
  } else if (isYesterday(date)) {
    return `Yesterday`;
  } else if (isThisWeek(date)) {
    return `${format(date, "EEEE")}`;
  } else {
    return `${format(date, "dd/MM/yyyy")}`;
  }
};

export const Conversation = ({ conversation, onSelectConversation }:{conversation: any, onSelectConversation: any}) => {
  const currUser = useSelector((state: RootState) => state.user.currUser);

  const frndUser = conversation.members.find(
    (member) => member.user.id !== currUser?.id
  );

  const frndName = frndUser.user.username;
  console.log("Friend name is ", frndName);
  return (
    <div
      className="conversation"
      onClick={() => {
        onSelectConversation(conversation, frndUser);
      }}
    >
      <div className="conversation-img">
        <ConversationImage frndImg={frndUser.user.avatarUrl} />
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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from "react-redux";
import "./message.css";
import {format, isThisWeek, isToday, isYesterday} from "date-fns";
import { CheckCheck } from "lucide-react";
import { RootState } from "../../redux/store";

const dateFormater = (date: string) => {
  if(isToday(date)){
    return `${format(date, "HH: MM a")}`
  } else if(isYesterday(date)){
    return `Yesterday ${format(date, "HH: MM a")}`
  } else if(isThisWeek(date)){
    return `${format(date, "EEEE HH: MM a")}`
  } else {
    return `${format(date, "dd/MM/yyyy HH: MM a")}`
  }
}


export const Message = ({message}:{message: any}) => {
  const currUser = useSelector((state: RootState) => state.user.currUser) as { id: string } | null;

  // const currConversation = useSelector((state) => state.conversation.currConversation);
  const currUserId = currUser?.id;

  return (
    <div className={`message ${message.senderId === currUserId ? "owner" : " "}`}>
      <img src="/hero.jpg" alt="" />
      <div className="msg">
        <p>{message.content}</p>
        <div className="msg-info">
          <div className="msg-time">{dateFormater(message.createdAt)}</div>
          <div className="msg-status">
            <CheckCheck size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};   
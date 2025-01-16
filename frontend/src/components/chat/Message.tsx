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
    return `Yesterday`
  } else if(isThisWeek(date)){
    return `${format(date, "EEEE")}`
  } else {
    return `${format(date, "dd/MM/yyyy")}`
  }
}


export const Message = ({message}:{message: any}) => {
  const currUser = useSelector((state: RootState) => state.user.currUser) ;
  const frndUser = useSelector((state: RootState) => state.conversation.frndUser);

  return (
    <div className={`message ${message.senderId === currUser?.id ? "owner" : " "}`}>
      <img src={message.senderId === currUser?.id ? currUser?.avatarUrl : frndUser?.user.avatarUrl} alt="" />
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
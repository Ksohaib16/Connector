import { useState } from "react";
import "./TranslationSettingModal.css";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
export const TranslationSettingModal = ({
  handleClick,
}: {
  handleClick: ({ conversationId, from, to }: { 
    conversationId: string, 
    from: string, 
    to: string 
  }) => void;
}) => {
  const [from, setFrom] = useState("Auto-Detect");
  const [to, setTo] = useState("English");
  const conversationId = useSelector(
    (state: RootState) => state.conversation.currConversation?.id
  );

  const handleFrom = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFrom(e.target.value);
  };

  const handleTo = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTo(e.target.value);
  };

  return (
    <div className="translation-verification-modal">
      <div className="translation-modal-background "></div>
      <div className="translation-modal-card ">
        <h3 className="heading text-[1.4rem] font-medium pb-[1rem] text-[white]">
          Translation Setting
        </h3>
        <div className="options from">
          <div className="select">
            <label htmlFor="from">From:</label>
            <select
              name="from"
              id="from"
              className="select"
              value={from}
              onChange={handleFrom}
            >
              <option value="Auto-Detect">Auto-Detect</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="Hinglish">Hinglish</option>
              <option value="Marathi">Marathi</option>
              <option value="Kannada">Kannada</option>
            </select>
          </div>
          <div className="select to">
            <label htmlFor="to">To:</label>
            <select
              name="from"
              id="to"
              className="select"
              value={to}
              onChange={handleTo}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="Hinglish">Hinglish</option>
              <option value="Marathi">Marathi</option>
              <option value="Kannada">Kannada</option>
            </select>
          </div>
        </div>
        <button onClick={() => handleClick({conversationId, from, to})}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

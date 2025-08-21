import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { X } from "lucide-react";

interface ConversationShape {
  id: string;
  members: Array<{ user: { id: string; username?: string; avatarUrl?: string } }>;
}

export const TranslationSettingModal = ({
  handleClick,
  onClose,
}: {
  handleClick: (payload: {
    conversationId: string;
    from: string;
    to: string;
  }) => void;
  onClose?: () => void;
}) => {
  const [from, setFrom] = useState("English");
  const [to, setTo] = useState("English");

  const currConversation = useSelector(
    (state: RootState) => state.conversation.currConversation as ConversationShape | null
  );

  const handleSave = () => {
    if (currConversation?.id) {
      handleClick({ conversationId: currConversation.id, from, to });
      onClose?.();
    }
  };

  const languages = ["English", "Spanish", "Hinglish", "Marathi", "Kannada"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-sm mx-4 p-6 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-white">Translation Setting</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-700 transition"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Selects */}
        <div className="space-y-4">
          <div>
            <label htmlFor="from" className="block text-sm font-medium text-gray-300 mb-1">
              From
            </label>
            <select
              id="from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-300 mb-1">
              To
            </label>
            <select
              id="to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-medium transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

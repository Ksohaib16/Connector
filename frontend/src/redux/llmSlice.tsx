import { createSlice } from "@reduxjs/toolkit";

interface ConversationSetting {
  from: string;
  to: string;
}

interface TranslationSetting {
  [conversationId: string]: ConversationSetting;
}

interface Setting {
  translationSetting: TranslationSetting;
}
const initialState: Setting = {
  translationSetting: {},
};

export const translatorSlice = createSlice({
  name: "translator",
  initialState,
  reducers: {
    setTranslationSetting: (state, action) => {
      const { conversationId, from, to } = action.payload;

      return {
        ...state,
        translationSetting: {
          ...state.translationSetting, // Keeps all other conversations
          [conversationId]: { from, to }, // Updates or adds this conversation
        },
      };
    },
  },
});

export const { setTranslationSetting } = translatorSlice.actions;
export default translatorSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

interface NotificationCount{
  [conversationId: string]: number
}

const notificationCount: NotificationCount = {};

export const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    currConversation: null,
    frndUser: null,
    conversations: [],
    notificationCount,
  },
  reducers: {
    setCurrConversation: (state, action) => {
      state.currConversation = action.payload.conversation;
      state.frndUser = action.payload.frndUser;
    },

    setConversations: (state, action) => {
      state.conversations = action.payload;
    },

    updateConversation: (state, action) => {
      const updatedConversation = action.payload;
      state.conversations = state.conversations.map((conversation) =>
        conversation.id === updatedConversation.id
          ? updatedConversation
          : conversation
      );
    },

    addConversation: (state, action) => {
      state.conversations.push(action.payload);
    },

    addNotification: (state, action) => {
      const {conversationId, count} = action.payload;
      state.notificationCount = {
        ...state.notificationCount,
        [conversationId]: count
      }
    },

    removeNotification: (state, action) => {
      state.notificationCount = action.payload;
    },
  },
});

export const {
  setCurrConversation,
  setConversations,
  updateConversation,
  addConversation,
  addNotification,
  removeNotification,
} = conversationSlice.actions;

export default conversationSlice.reducer;

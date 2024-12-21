import { Router } from "express";
import { verifyToken } from "../firebase-config/firebaseConfig";
import {
  getFriend,
  createConversationAndMember,
  getAllConversation,
} from "../controllers/conversationController";

import {
  createMessage,
  getAllMessages,
} from "../controllers/messageController";

const router = Router();

router.get("/friend", verifyToken, getFriend);

router.post("/addFriend", verifyToken, createConversationAndMember);

router.get("/conversations", verifyToken, getAllConversation);

router.post("/messages", verifyToken, createMessage);

router.get("/messages/:conversationId", verifyToken, getAllMessages);

export default router;

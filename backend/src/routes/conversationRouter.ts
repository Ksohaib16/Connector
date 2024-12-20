import { Router } from "express";
import { verifyToken } from "../firebase-config/firebaseConfig";
import {
  getFriend,
  createConversationAndMember,
  getAllConversation,
} from "../controllers/conversationController";
const router = Router();

router.get("/friend", verifyToken, getFriend);

router.post("/addFriend", verifyToken, createConversationAndMember);

router.post("/conversations", verifyToken, getAllConversation);

export default router;

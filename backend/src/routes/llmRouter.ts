import {Router } from "express"
const router = Router();
import { verifyToken } from "../firebase-config/firebaseConfig";
import { inputTranslator, chatTranslator } from "../controllers/llmController";

router.post("/inputtext",  inputTranslator);

router.post("/chat",  chatTranslator);

export default router;

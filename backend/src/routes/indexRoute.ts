import express from "express";
import { Router } from "express";
import authRouter from "./authRouter"
import conversationRouter from "./conversationRouter"
import llmRouter from "./llmRouter"
import presenceRouter from "./presenceRouter"
const router = Router();

router.use("/auth", authRouter)
router.use("/user", conversationRouter)
router.use("/translate", llmRouter)
router.use("/presence", presenceRouter)

export default router;

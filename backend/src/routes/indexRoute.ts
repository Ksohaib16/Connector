import express from "express";
import { Router } from "express";
import authRouter from "./authRouter"
const router = Router();

router.use("/auth", authRouter) 

export default router;
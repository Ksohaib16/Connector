import { Router } from "express"
import { verifyToken } from "../firebase-config/firebaseConfig";
const router = Router();
import {login, signup} from "../controllers/authController"

router.post("/signup", verifyToken, signup)
router.post("/login", verifyToken, login)

export default router
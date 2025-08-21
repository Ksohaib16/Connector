import { Router } from 'express';
import { verifyToken } from '../firebase-config/firebaseConfig';
import { setPresence } from '../controllers/presenceController';

const router = Router();

router.post('/', verifyToken, setPresence);

export default router;



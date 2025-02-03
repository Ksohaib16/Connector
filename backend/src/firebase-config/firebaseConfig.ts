import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: 'connector-10d1a', // Replace with your actual project ID
            clientEmail: 'firebase-adminsdk-rkwua@connector-10d1a.iam.gserviceaccount.com', // Replace with the client_email from the JSON
            privateKey: process.env.FIREBASE_KEY, // Replace with private_key from the JSON
        }),
    });
}

declare module 'express-serve-static-core' {
    namespace Express {
        interface Request {
            user?: admin.auth.DecodedIdToken;
        }
    }
}

export const verifyToken = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.status(401).json({ error: 'Unauthorized: No token provided' });
        return;
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized: Invalid token format' });
        return;
    }
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
};

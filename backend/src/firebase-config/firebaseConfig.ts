import admin from 'firebase-admin';
import { Request, Response, NextFunction } from 'express';

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: 'connector-10d1a',
            clientEmail: 'firebase-adminsdk-rkwua@connector-10d1a.iam.gserviceaccount.com',
            privateKey:
                '-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCmlkXRqvcDTcXs\nfNBNLECCJgR3WP7EzU9u3/IkOln26B16tWIWXdmeTR8K9m2JofkHD+CHQirOG6rS\nlusuAmVS4tXe/p2VJnSRH4QSbnD+Fk9R+HBU3mr+lDhm2kjGW7YQEiqVRjEtJ5WO\nVam6kj2PDdFKQmWt6z9xuuiuFnpYHzB5LSAJiCxYxrx8UXAcbOD5mc+AEKNsSQo1\ns9EXU3Vb/Z4wAr3yd67ZU/4D3aCw+RrM3e45oqcPgih+2/rBoHQ+EMmhJR5WGs+L\nYkLMMLRJ2oOXy+lvIJmrLJwD55mMfC3BjqNt61redOt2Ju+Sg2x6DPHFv4PESlnY\n1PUL76v1AgMBAAECggEAO06cpLydHEv//uWgsxjiDnPCe0rvyNjfQrXv2v37MXAJ\nrroMpbHb3APQ3XJGJQ3JPr5kTUM9QguPkVGxgLvRnuSrB6zWJVd/gHsb5gPzrkH7\nE0/DjjNxHBlgyx1Dc3sLIkWVa3eF4nGJSRcuSgHucJOWwz1IPdbWy4Kje/b8r4o3\nLpj0Q3REl2eS8AHgOZXiDqrU+hexsSvZ/2JXevcs84DrLzKE9jdNLvBKoCsWilG4\nHa+zgwTzpL7wEVOy5Vlwjb7rnVBgsygSnrgcLTgl0zyPSnN7dROMm7x+Ek9+26le\ndHwwFeNsYMBXcAbUpA6aT7zq6D0yOpRhcp4e4c49sQKBgQDl+cD8D3hDlUuHyt/M\n9Wy4ZteD4XVH4LA8mlVqIg+ElkFjS5SQF4YalCatjIJwWgpuSiylQqV1UrbNkWbE\niUeSdp96DIvaI04PbBUlAdyiVZYZqIFSp7WsnKUmMttCG4ikCsqSPIGvZJUzgqoP\nk7STj2W8lZptpvKaHqplnN34lwKBgQC5cDEUWR5CmzvksINo1K/kDsb+zhYowdNn\nLiCTfYJZuUAg6MGyWIFGm30seQyOKDt+1FOdScHUBHq5PY5x8MMG1GU6B13R1LHq\nT+ZBJlCGkmoKy8FfmvhFf9YhyKX7PcZxB0WTNgbDyclVX8dvCg06+yngvAP3s9nK\nGIfZpk/lUwKBgQC+IwfTXlboSX7w/mKaai9BJoX4m2cDzljnQhJsdUyvKitVlR93\nInvVbbestQcDLO6C0QCogbmajpBk1VpKE9YA2eJwXf8ikx3u0kWJG0j3ThuTiyWg\n2Nfzpm9EbbepqGoIdoOU9EGkaVySAe3ogw5BEcXjbS0Ii4b4tXHcIR3EcQKBgQCQ\nIsBDTLHUm8yGCR1bUlYVMddDHvTiYSXswVHY0mmLTA6ohcJo2ZpCQ4GcG8rChEsa\nXfdP/pCGN6UcbthVgApXOKgl3qvx+R0BP3F9mkZlE1ERaya3JUFs49yRDeDV1EJ2\ngGx37Dp93E596aCeknWOLsNyRzHeSxExoLeXWUoouQKBgQConPRb0YJq9aEYA80a\nDMkJA1hKVkk3WZuEoZ6kgMk1EpswqrIaO4wWBHUDVN4jA+6uIRPFvIMECPafXkIl\ncl80qDSIpneRSBtYl8MXWdllSfEKsCvcY973Chb4zPkGJLMpCFvDG/Zeju/wn1+3\npYNArwzw53WPo2QK+Q576beAxQ==\n-----END PRIVATE KEY-----\n'.replace(
                    /\\n/g,
                    '\n',
                ),
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

import express, { Request, Response } from 'express';
import './db/prisma';
import { errorHandler } from './utility/errorHandler';
import rootRouter from './routes/indexRoute';
import cors from 'cors';

const app = express();

// CORS
app.use(
    cors({
        origin: [
            'https://connector-five.vercel.app',
            'https://connector-sohaibs-projects-1c7baf9c.vercel.app',
            'http://localhost:5173',
        ],
        credentials: true,
    }),
);

app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const timeout = 30000;
app.use((req, res, next) => {
    req.setTimeout(timeout);
    res.setTimeout(timeout);
    next();
});

app.use('/api/v1', rootRouter);

app.all('*', (req: Request, res: Response) => {
    console.log('404 route hit for:', req.url);
    res.status(404).json({
        message: 'Page Not Found',
    });
});

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', (): void => {
    console.log(`Server is running on port ${PORT}`);
});

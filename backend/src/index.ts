import express, { Request, Response } from 'express';
import './db/prisma';
import { errorHandler } from './utility/errorHandler';
import rootRouter from './routes/indexRoute';
import cors from 'cors';

const app = express();

// CORS
app.use(cors());

app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const timeout = 30000;
app.use((req, res, next) => {
    req.setTimeout(timeout);
    res.setTimeout(timeout);
    next();
});

app.get('/api/v1/test', (req, res) => {
    res.send('Server is running');
});

app.use('/api/v1', rootRouter);

app.all('*', (req: Request, res: Response) => {
    console.log('404 route hit for:', req.url);
    res.status(404).json({
        message: 'Page Not Found',
    });
});

app.use(errorHandler);

app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`);
});

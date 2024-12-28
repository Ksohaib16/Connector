import { Request, Response, NextFunction } from 'express';
import { AsyncRequestHandler } from '../types/error.types';

export const WrapAsync = (fn: AsyncRequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}
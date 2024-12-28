import { Request, Response, NextFunction } from "express";

 export type ErrorStatus = "success" | "fail" | "error";

export interface IAppError extends Error {
  statusCode: number;
  status: ErrorStatus;
  message: string;
  data?: any;
  stack?: string;
  isOperational: boolean;
}

export type ErrorHandler = (
  err: IAppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;
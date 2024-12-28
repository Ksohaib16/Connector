import { ErrorHandler } from "../types/error.types";
import { CustomError } from "./CustomError";

type ApiResponse<T> = {
  status: 'success' | 'fail' | 'error';
  message?: string;
  data?: T
  stack?: string;
  isOperational?: boolean;
};

export const errorHandler: ErrorHandler = (err, req, res, next) => {
    const isCustomError = err instanceof CustomError;
  
    const statusCode = isCustomError ? err.statusCode : 500;
    const status = isCustomError ? err.status : 'error';

    const errorResponse: ApiResponse<null> = {
      status,
      message: err.message || 'Something went wrong',
    }

      // Add development details when appropriate
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.isOperational = isCustomError ? err.isOperational : false;
  }
  
    res.status(statusCode).json(errorResponse);
  };
  
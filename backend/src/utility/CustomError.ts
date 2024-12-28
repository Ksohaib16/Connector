import { IAppError } from "../types/error.types";
import { ErrorStatus } from "../types/error.types";

export class CustomError extends Error implements IAppError {
    public readonly statusCode: number;
    public readonly status: ErrorStatus;
    public readonly data: any;
    public readonly isOperational: boolean;

    constructor( statusCode: number,message: string, data?: any) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
        this.data = data;
        this.isOperational = true;
    }
}
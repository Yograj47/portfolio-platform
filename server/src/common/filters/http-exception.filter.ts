import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";
import { Request, Response } from "express";
import { ApiError } from "../interfaces/api-error.interface";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();

        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse();

        let message: string | string[];

        if (typeof exceptionResponse === "string") {
            message = exceptionResponse;
        } else {
            message = (exceptionResponse as { message: string | string[] }).message;
        }

        const errorResponse: ApiError = {
            success: false,
            statuscode: status,
            message,
            path: request.url,
            timestamp: new Date().toISOString(),
        };

        response.status(status).json(errorResponse);
    }
}
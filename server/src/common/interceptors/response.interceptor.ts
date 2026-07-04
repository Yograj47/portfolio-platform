import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { ApiResponse } from "../interfaces/api-response.interface";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Reflector } from "@nestjs/core";
import { RESPONSE_MESSAGE_KEY } from "../constants/response-message.constant";

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
    constructor(private reflector: Reflector) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {

        const response = context.switchToHttp().getResponse();

        const message = this.reflector.get<string>(
            RESPONSE_MESSAGE_KEY,
            context.getHandler(),
        ) ?? "Success";

        return next.handle().pipe(
            map((data) => ({
                success: true,
                statusCode: response.statusCode,
                message,
                data,
                timestamp: new Date().toISOString()
            }))
        );
    }
}
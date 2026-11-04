import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import type { Request, Response } from 'express';
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    let status = 500;
    let message: string | string[] = 'Internal server error';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      message =
        typeof body === 'string'
          ? body
          : (body as { message: string | string[] }).message;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const errors: Record<string, [number, string]> = {
        P2002: [409, 'A record with this value already exists'],
        P2003: [400, 'Referenced record is missing or still in use'],
        P2025: [404, 'Record not found'],
        P2034: [409, 'Concurrent update; please retry'],
      };
      [status, message] = errors[exception.code] ?? [
        500,
        'Database operation failed',
      ];
    }
    if (status >= 500)
      this.logger.error(
        'Request failed: ' +
          (exception instanceof Error ? exception.name : 'UnknownError'),
      );
    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: request.path,
      timestamp: new Date().toISOString(),
    });
  }
}

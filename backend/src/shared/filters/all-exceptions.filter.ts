import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException 
      ? exception.getStatus() 
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorResponse = exception instanceof HttpException 
      ? exception.getResponse() 
      : { message: 'Internal Server Error' };

    const message = typeof errorResponse === 'object' && 'message' in errorResponse 
      ? errorResponse.message 
      : errorResponse;

    response.status(status).json({
      success: false,
      data: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
      error: {
        code: status,
        message,
        details: Array.isArray(message) ? message : [message]
      }
    });
  }
}

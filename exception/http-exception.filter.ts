
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ThrottlerException } from '@nestjs/throttler';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: ExceptionFilter, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // exception zod validation
    if (exception instanceof ZodError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        message: 'error validation',
        errors: exception.errors.map((err) => {
          return {
            path: err.path[0],
            message: err.message,
          };
        })
      })
    }

    // exception rate limiter
    if (exception instanceof ThrottlerException) {
      response.status(HttpStatus.TOO_MANY_REQUESTS).json({
        message: 'Too Many Requests',
      })
    }

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(httpStatus).json({
      message: exception,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    });
  }
}

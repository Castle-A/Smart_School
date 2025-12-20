import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomLogger } from '../logger/custom-logger.service';

/**
 * Filtre d'exceptions global (Master Quality)
 * Standardise les réponses d'erreur et centralise le logging pour améliorer l'observabilité.
 */
@Injectable()
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new CustomLogger();

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Détermination du status HTTP
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extraction du message d'erreur
    let message = 'Une erreur interne est survenue';
    let details: any = null;

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
      details =
        typeof exceptionResponse === 'object' ? exceptionResponse : null;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    // Logging structuré selon la sévérité (Master Observability)
    const errorContext = {
      path: request.url,
      method: request.method,
      ip: request.ip,
      userId: (request as any).user?.userId,
      schoolId: (request as any).user?.schoolId,
    };

    if (status >= 500) {
      // Erreurs serveur : Log complet avec stack trace
      this.logger.error(
        `[${status}] ${message}`,
        exception instanceof Error ? exception.stack : '',
        'GlobalExceptionFilter',
      );
    } else {
      // Erreurs client : Log allégé
      this.logger.warn(
        `[${status}] ${message} - ${request.method} ${request.url}`,
        'GlobalExceptionFilter',
      );
    }

    // Réponse standardisée (Master Quality)
    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message: message,
      // Stack trace uniquement en développement pour faciliter le debugging
      ...(process.env.NODE_ENV !== 'production' && exception instanceof Error
        ? { stack: exception.stack }
        : {}),
    };

    response.status(status).json(errorResponse);
  }
}

import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class FingerprintExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Unique Error Signature (Fingerprint)
    // If a cloned site has this specific error structure, it proves the backend is ours.
    const fingerprint = {
      _sys_code: 'KIV-ERR-7721',
      _trace: 'AGPL-SIGNED',
    };

    if (typeof exceptionResponse === 'object') {
      response
        .status(status)
        .json({
          ...exceptionResponse,
          ...fingerprint,
        });
    } else {
      response
        .status(status)
        .json({
          statusCode: status,
          message: exceptionResponse,
          ...fingerprint,
        });
    }
  }
}

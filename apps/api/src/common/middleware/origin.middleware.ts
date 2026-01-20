
import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class OriginGuardMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const origin = req.headers['origin'];
    const referer = req.headers['referer'];
    
    // Skip check for non-browser clients (like cURL) or dev if needed, 
    // BUT for high security we might want to enforce signature.
    // For now, allow cloud-to-cloud (no origin) but if Origin IS present, it MUST be whitelisted.
    
    if (origin) {
         const allowedOrigins = [
             process.env.FRONTEND_URL || 'http://localhost:3001',
             'https://kivvat.com',
             'https://www.kivvat.com'
         ];
         
         const isAllowed = allowedOrigins.some(allowed => origin === allowed || origin.endsWith('.kivvat.com'));
         
         if (!isAllowed) {
             console.warn(`[Security] Blocked unauthorized origin: ${origin}`);
             throw new ForbiddenException('Access Denied: CIO-99 Security Policy Violation');
         }
    }
    
    next();
  }
}

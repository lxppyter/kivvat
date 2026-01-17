import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class WatermarkMiddleware implements NestMiddleware {
  private readonly logger = new Logger('System');
  private readonly SIGNATURE = 'KIVVAT-AGPLv3-PROTECTED-7A9F2';

  use(req: Request, res: Response, next: NextFunction) {
    // 1. Inject Ownership Header (Anti-Theft Tag)
    res.setHeader('X-System-Owner', 'Kivvat Inc.');
    res.setHeader('X-License', 'AGPL-3.0-only');
    
    // 2. Inject Hidden "Signature" (Trap for direct copiers)
    // This value is a unique hash that proves origin if found in other systems
    res.setHeader('X-Runtime-Signature', this.SIGNATURE);

    // 3. Obfuscate Technology Stack slightly to annoy recon
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Powered-By', 'ReguTrack-Secure-Engine/2.4.0');

    next();
  }
}

import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class AuditorReadOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // If no user is logged in, this guard doesn't apply (AuthGuard handles that)
    if (!user) {
      return true;
    }

    // Check if user is an AUDITOR
    if (user.role === 'AUDITOR') {
      const method = request.method.toUpperCase();
      // Block mutation methods
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        // Exception: Allow Auditors to run scans
        if (request.url.includes('/scanner/')) {
          return true;
        }
        
        // Exception: Allow logout or specific read-only audits if strictly needed, 
        // but generally auditors shouldn't write.
        // If there's a specific endpoint auditors NEED to write to (like logging access), 
        // we can add exemptions here.
        throw new ForbiddenException('Auditors have Read-Only access.');
      }
    }

    return true;
  }
}

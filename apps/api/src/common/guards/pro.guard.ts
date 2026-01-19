import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class ProGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user) return false;

    // Allow PRO and ENTERPRISE
    if (user.plan === 'PRO' || user.plan === 'ENTERPRISE') {
        return true;
    }

    // Block CORE and FREE
    throw new ForbiddenException('Bu özellik için TRUST ARCHITECT (Pro) veya TOTAL AUTHORITY (Enterprise) paketi gereklidir.');
  }
}

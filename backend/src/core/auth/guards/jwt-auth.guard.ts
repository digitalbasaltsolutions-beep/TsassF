import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ClsServiceManager } from 'nestjs-cls';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    
    // Set tenant context for this request if user is authenticated
    const cls = ClsServiceManager.getClsService();
    if (cls && cls.isActive()) {
      cls.set('userId', user.userId);
      cls.set('role', user.role);
      if (user.organizationId) {
        cls.set('organizationId', user.organizationId);
      }
    }

    return user;
  }
}

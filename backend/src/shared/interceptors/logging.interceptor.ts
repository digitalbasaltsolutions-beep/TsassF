import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, query, body, user } = request;
    const now = Date.now();

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;
        const orgId = user?.organizationId || 'unbound';
        const userId = user?.userId || 'anonymous';
        
        this.logger.log(`${method} ${url} | Org: ${orgId} | User: ${userId} | Duration: ${duration}ms`);
        
        // Performance Alert for slow endpoints (> 1000ms)
        if (duration > 1000) {
          this.logger.warn(`⚠️ SLOW ENDPOINT: ${method} ${url} took ${duration}ms! Consider query optimization.`);
        }
      }),
    );
  }
}

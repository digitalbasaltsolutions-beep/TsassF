import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  data: T;
  meta: any;
  error: any;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => {
        // If the data already has a 'data' and 'meta' field (e.g. from paginated service), use them
        const isPaginated = data && typeof data === 'object' && 'data' in data && 'meta' in data;
        
        return {
          success: true,
          data: isPaginated ? data.data : data,
          meta: isPaginated ? data.meta : {},
          error: null,
        };
      }),
    );
  }
}

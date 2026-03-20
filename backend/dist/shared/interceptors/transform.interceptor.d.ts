import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export interface Response<T> {
    success: boolean;
    data: T;
    meta: any;
    error: any;
}
export declare class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
    private readonly logger;
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>>;
}

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ObservabilityService } from './observability.service';

@Injectable()
export class HttpObservabilityInterceptor implements NestInterceptor {
  constructor(
    private readonly obs: ObservabilityService,
  ) { }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const method = req.method;
    const route = req.url ?? 'unknown';

    const spanName = `HTTP ${method} ${route}`;
    const start = Date.now();

    return new Observable((subscriber) => {
      this.obs
        .span(spanName, async () => {
          return new Promise<void>((resolve, reject) => {
            next
              .handle()
              .pipe(
                tap(() => {
                  const durationMs = Date.now() - start;

                  this.obs.histogram(
                    'http.server.duration',
                    durationMs,
                    {
                      method,
                      route,
                      status: res.status,
                    },
                  );
                }),
                catchError((err) => {
                  this.obs.counter(
                    'http.server.errors',
                    1,
                    {
                      method,
                      route,
                      status: res.status,
                    },
                  );
                  reject(err);
                  throw err;
                }),
              )
              .subscribe({
                next: (value) => subscriber.next(value),
                error: (err) => subscriber.error(err),
                complete: () => {
                  resolve();
                  subscriber.complete();
                },
              });
          });
        })
        .catch((err) => subscriber.error(err));
    });
  }
}
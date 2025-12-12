import { Global, Module, Scope } from '@nestjs/common';
import { ILogger } from './logging.interface';
import { LogService } from './services/logging.service';
import { RequestContextModule } from 'nestjs-request-context';
import { CorrelationIdMiddleware } from './middleware/correlationid.middleware';

@Global()
@Module({
  imports: [RequestContextModule],
  providers: [
    {
      provide: ILogger,
      useClass: LogService,
      scope: Scope.TRANSIENT,
    },
    CorrelationIdMiddleware,
    LogService
  ],
  exports: [ILogger, CorrelationIdMiddleware, LogService],
})
export class LoggingModule { }
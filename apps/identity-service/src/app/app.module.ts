import { ConfigurationModule } from '@deigma/configuration';
import { CorrelationIdMiddleware, LoggingModule } from '@deigma/logging';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigurationService } from '../configuration/configuration.service';
import { HealthModule } from '../health/health.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    ConfigurationModule.register({
      useClass: ConfigurationService,
    }),
    HealthModule,
    LoggingModule,
    UsersModule
  ],
  providers: [],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*path');
  }
}   
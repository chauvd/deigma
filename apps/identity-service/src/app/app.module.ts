import { ConfigurationModule } from '@deigma/configuration';
import { CorrelationIdMiddleware, LoggingModule } from '@deigma/logging';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigurationService } from '../configuration/configuration.service';
import { HealthModule } from '../health/health.module';
import { MappersModule } from '../mapper/mapper.module';
import { TenantMembershipsModule } from '../tenant/membership/membership.module';
import { TenantSubscriptionsModule } from '../tenant/subscription/subscription.module';
import { TenantsModule } from '../tenant/tenant.module';
import { UsersModule } from '../users/users.module';
import { AppCacheModule } from './cache.module';
import { AppDatabaseModule } from './database.module';
import { AppObservabilityModule } from './observability.module';
import { HttpObservabilityInterceptor } from '@deigma/observability';

@Module({
  imports: [
    ConfigurationModule.register({
      useClass: ConfigurationService,
    }),
    AppCacheModule,
    AppDatabaseModule,
    AppObservabilityModule,
    HealthModule,
    LoggingModule,
    MappersModule,
    TenantsModule,
    TenantMembershipsModule,
    TenantSubscriptionsModule,
    UsersModule
  ],
  providers: [
    HttpObservabilityInterceptor
  ],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*path');
  }
}   
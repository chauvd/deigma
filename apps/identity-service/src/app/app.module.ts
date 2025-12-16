import { ConfigurationModule } from '@deigma/configuration';
import { CorrelationIdMiddleware, LoggingModule } from '@deigma/logging';
import { ObservabilityModule } from '@deigma/observability';
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

@Module({
  imports: [
    ConfigurationModule.register({
      useClass: ConfigurationService,
    }),
    AppCacheModule,
    AppDatabaseModule,
    HealthModule,
    LoggingModule,
    ObservabilityModule,
    MappersModule,
    TenantsModule,
    TenantMembershipsModule,
    TenantSubscriptionsModule,
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
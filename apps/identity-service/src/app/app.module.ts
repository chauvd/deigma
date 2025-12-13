import { ConfigurationModule } from '@deigma/configuration';
import { CorrelationIdMiddleware, LoggingModule } from '@deigma/logging';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigurationService } from '../configuration/configuration.service';
import { HealthModule } from '../health/health.module';
import { UsersModule } from '../users/users.module';
import { MappersModule } from '../mapper/mapper.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigurationModule.register({
      useClass: ConfigurationService,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigurationModule],
      useFactory: async (configService: ConfigurationService) => ({
        uri: configService.databaseUrl,
      }),
      inject: [ConfigurationService]
    }),
    HealthModule,
    LoggingModule,
    MappersModule,
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
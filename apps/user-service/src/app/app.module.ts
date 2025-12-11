import { ConfigurationModule } from '@deigma/configuration';
import { Module } from '@nestjs/common';
import { ConfigurationService } from '../configuration/configuration.service';
import { HealthModule } from '../health/health.module';

@Module({
  imports: [
    ConfigurationModule.register({
      useClass: ConfigurationService,
    }),
    HealthModule
  ],
  providers: [],
  controllers: [],
})
export class AppModule { }   
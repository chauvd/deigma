// apps/identity-service/src/config/identity-service.configuration.ts
import { Injectable } from '@nestjs/common';
import { BaseConfigurationService } from '@deigma/configuration';

@Injectable()
export class ConfigurationService extends BaseConfigurationService {

  get databaseUrl(): string {
    return this.get('DATABASE_URL');
  }
}
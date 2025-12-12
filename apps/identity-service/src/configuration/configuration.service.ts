// apps/identity-service/src/config/identity-service.configuration.ts
import { Injectable } from '@nestjs/common';
import { BaseConfigurationService } from '@deigma/configuration';

@Injectable()
export class ConfigurationService extends BaseConfigurationService {

  // identity-service specific getters
  get jwtSecret(): string {
    return this.get('JWT_SECRET');
  }

  get jwtExpirationTime(): string {
    return this.get('JWT_EXPIRATION_TIME');
  }

  get databaseHost(): string {
    return this.get('DATABASE_HOST');
  }

  get databasePort(): number {
    return this.getNumber('DATABASE_PORT');
  }

  // ... other identity-service specific getters
}
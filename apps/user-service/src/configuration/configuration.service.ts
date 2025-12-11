// apps/user-service/src/config/user-service.configuration.ts
import { Injectable } from '@nestjs/common';
import { BaseConfigurationService } from '@deigma/configuration';

@Injectable()
export class ConfigurationService extends BaseConfigurationService {
    
  // User-service specific getters
  get jwtSecret(): string {
    return this.get('JWT_SECRET');
  }

  get jwtExpirationTime(): string {
    return this.get('JWT_EXPIRATION_TIME');
  }

  get logLevel(): string {
    const logLevel = this.get('LOG_LEVEL');
    if (!['debug', 'info', 'warn', 'error'].includes(logLevel)) {
      throw new Error(`Config error: LOG_LEVEL is not a valid log level`);
    }
    return logLevel;
  }

  get databaseHost(): string {
    return this.get('DATABASE_HOST');
  }

  get databasePort(): number {
    return this.getNumber('DATABASE_PORT');
  }

  // ... other user-service specific getters
}
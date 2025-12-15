// apps/identity-service/src/config/identity-service.configuration.ts
import { Injectable } from '@nestjs/common';
import { BaseConfigurationService } from '@deigma/configuration';

@Injectable()
export class ConfigurationService extends BaseConfigurationService {

  get databaseUrl(): string {
    return this.get('DATABASE_URL');
  }

  get redisUrl(): string {
    return this.get('REDIS_URL');
  }

  get redisNamespace(): string {
    return this.get('REDIS_NAMESPACE', 'idx');
  }

  get redisKeyPrefixSeparator(): string {
    return this.get('REDIS_KEY_PREFIX_SEPARATOR', ':');
  }

}
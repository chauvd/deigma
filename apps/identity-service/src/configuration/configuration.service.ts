import { Injectable } from '@nestjs/common';
import { BaseConfigurationService } from '@deigma/configuration';

@Injectable()
export class ConfigurationService extends BaseConfigurationService {
  get appAudience(): string {
    return this.get('APP_AUDIENCE');
  }

  get databaseUrl(): string {
    return this.get('DATABASE_URL');
  }

  get issuerBaseUrl(): string {
    return this.get('IDP_ISSUER');
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

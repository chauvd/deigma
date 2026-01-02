import { Logger } from '@nestjs/common';
import { ConfigService as NestedConfig } from '@nestjs/config';

export abstract class BaseConfigurationService {
  private readonly logger = new Logger(BaseConfigurationService.name);

  constructor(protected configService: NestedConfig) {}

  protected get(key: string, defaultValue?: string): string {
    const value = process.env[key] ?? this.configService?.get<string>(key);
    if (!value) {
      if (defaultValue) {
        return defaultValue;
      }
      throw new Error(`Config error: ${key} is not defined`);
    }
    return value;
  }

  protected getArray(key: string): string[] {
    const value = process.env[key] ?? this.configService?.get<string>(key);
    if (!value) {
      throw new Error(`Config error: ${key} is not defined`);
    }
    return value.split(',');
  }

  protected getBoolean(key: string): boolean {
    const value = process.env[key] ?? this.configService?.get(key);
    if (!value) {
      throw new Error(`Config error: ${key} is not defined`);
    }
    return value === 'true';
  }

  protected getNumber(key: string): number {
    const value = process.env[key] ?? this.configService?.get(key);
    if (!value) {
      throw new Error(`Config error: ${key} is not defined`);
    }

    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      this.logger.log(`Config error: ${key} is not a valid number`);
      throw new Error(`Config error: ${key} is not a valid number`);
    }
    return parsedValue;
  }

  get environment(): string {
    return this.get('NODE_ENV');
  }

  get serverPort(): number {
    return this.getNumber('SERVER_PORT');
  }

  get isSwaggerEnabled(): boolean {
    return this.getBoolean('SWAGGER_ENABLED');
  }

  get swaggerTitle(): string {
    return this.get('SWAGGER_TITLE');
  }

  get swaggerDescription(): string {
    return this.get('SWAGGER_DESCRIPTION');
  }

  get appName(): string {
    return this.get('APP_NAME');
  }

  get logLevel(): string {
    const logLevel = this.get('LOG_LEVEL');
    if (!['debug', 'info', 'warn', 'error'].includes(logLevel)) {
      throw new Error(`Config error: LOG_LEVEL is not a valid log level`);
    }
    return logLevel;
  }

  get logTo(): string {
    const logTo = this.get('LOG_TO');
    if (!['console'].includes(logTo)) {
      throw new Error(`Config error: LOG_TO is not a valid log destination`);
    }
    return logTo;
  }
}

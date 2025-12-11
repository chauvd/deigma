import { ConfigService as NestedConfig } from '@nestjs/config';

export abstract class BaseConfigurationService {

  constructor(protected configService: NestedConfig) { }

  protected get(key: string): string {
    const value = process.env[key] ?? this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Config error: ${key} is not defined`);
    }
    return value;
  }

  protected getArray(key: string): string[] {
    const value = process.env[key] ?? this.configService.get<string>(key);
    if (!value) {
      throw new Error(`Config error: ${key} is not defined`);
    }
    return value.split(',');
  }

  protected getBoolean(key: string): boolean {
    const value = process.env[key] ?? this.configService.get(key);
    if (!value) {
      throw new Error(`Config error: ${key} is not defined`);
    }
    return value === 'true';
  }

  protected getNumber(key: string): number {
    const value = process.env[key] ?? this.configService.get(key);
    if (!value) {
      throw new Error(`Config error: ${key} is not defined`);
    }

    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue)) {
      console.log(`Config error: ${key} is not a valid number`);
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
}
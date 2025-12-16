import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import { ILogger } from '../logging.interface';
import { LogBaseService } from './logging.base.service';
import { BaseConfigurationService } from '@deigma/configuration';

@Injectable()
export class LogService extends LogBaseService implements ILogger {
  private readonly logger: winston.Logger;

  constructor(
    public override readonly configService: BaseConfigurationService,
  ) {
    super(configService);
    const logLevel = configService.logLevel;
    const logTo = configService.logTo;

    switch (logTo) {
      default: {
        this.logger = this.createConsoleLogger(logLevel);
        break;
      }
    }
  }

  public createChildLogger(context: string) {
    this.logger.defaultMeta = { context };
  }

  public async log(message: string, data?: any) {
    if (data) {
      this.logger.log({ level: 'info', message, data, ...this.defaultData });
    } else {
      this.logger.log({ level: 'info', message, ...this.defaultData });
    }
  }

  public async debug(message: string, data?: any) {
    if (data) {
      this.logger.debug(message + data, { data, ...this.defaultData });
    }
    this.logger.debug(message, { ...this.defaultData });
  }

  public async info(message: string, data?: any) {
    if (data) {
      this.logger.info(message + data, { data, ...this.defaultData });
    } else {
      this.logger.info(message, { ...this.defaultData });
    }
  }

  public async warn(message: string, data?: any) {
    if (data) {
      this.logger.warn(message + data, { data, ...this.defaultData });
    } else {
      this.logger.warn(message, { ...this.defaultData });
    }
  }

  public async error(message: string, data?: any) {
    if (data) {
      this.logger.error(message + data, { data, ...this.defaultData });
    } else {
      this.logger.error(message, { ...this.defaultData });
    }
  }
}
import { BaseConfigurationService } from '@deigma/configuration';
import { RequestContext } from 'nestjs-request-context';
import winston from 'winston';

export abstract class LogBaseService {
	constructor(protected readonly configService: BaseConfigurationService) { }

	protected createConsoleLogger(logLevel: string) {
		return winston.createLogger({
			level: logLevel,
			format: this.consoleFormat,
			transports: [new winston.transports.Console()],
		});
	}

	protected createErrsoleLogger(logLevel: string) {
		return winston.createLogger({
			level: logLevel,
			transports: [
				new winston.transports.Console({ format: this.consoleFormat }),
			],
		});
	}

	protected get correlationId() {
		const corelationId =
			RequestContext.currentContext?.req?.headers['x-correlation-id'] ||
			'no-correlation-id';
		return corelationId;
	}

	protected get consoleFormat() {
		const format = winston.format.combine(
			winston.format.timestamp(),
			winston.format.errors({ stack: true }),
			winston.format.cli(),
			winston.format.colorize(),
			winston.format.printf(({ level, message, ...meta }) => {
				const tag = `[${this.configService.appName}]`;
				return `${tag} ${level}: ${message} ${JSON.stringify(meta)}`;
			})
		);
		return format;
	}

	protected get winstonErrsoleFormat() {
		return winston.format.combine(
			winston.format((info) => {
				info['appName'] = this.configService.appName;
				return info;
			})(),
			winston.format.json()
		);
	}
}
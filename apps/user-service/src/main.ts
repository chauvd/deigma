import { ValidationPipe, VersioningOptions, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import compression from 'compression';
import { ConfigurationService } from './configuration/configuration.service';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    const configService = app.get(ConfigurationService);

    app.use(helmet());

    const globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    const defaultApiVersion = '1';
    const versioningOptions: VersioningOptions = {
      type: VersioningType.URI,
      defaultVersion: defaultApiVersion,
    };
    app.enableVersioning(versioningOptions);

    app.use(compression());

    const port = configService.serverPort;
    await app.listen(port ?? 3002);

    app.enableShutdownHooks();

    console.log(`🚀 Application is running on: http://localhost:${port}/v${defaultApiVersion}/${globalPrefix}`);
  } catch (err) {
    console.error('Failed to start server', err);
    throw err;
  }
}

bootstrap();

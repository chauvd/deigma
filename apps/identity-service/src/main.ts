import { OidcJwtAuthGuard } from '@deigma/authentication-core';
import { HttpObservabilityInterceptor } from '@deigma/observability';
import {
  Logger,
  ValidationPipe,
  VersioningOptions,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { ConfigurationService } from './configuration/configuration.service';

const logger = new Logger('main');

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());

    const reflector = app.get(Reflector);
    app.useGlobalGuards(new OidcJwtAuthGuard(reflector));

    app.useGlobalInterceptors(app.get(HttpObservabilityInterceptor));

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

    if (configService.isSwaggerEnabled) {
      const config = new DocumentBuilder()
        .setTitle(configService.swaggerTitle)
        .setDescription(configService.swaggerDescription)
        .setVersion(defaultApiVersion)
        .build();
      const documentFactory = () => SwaggerModule.createDocument(app, config);
      SwaggerModule.setup(
        `v${defaultApiVersion}/${globalPrefix}/swagger`,
        app,
        documentFactory
      );
    }

    const port = configService.serverPort;
    await app.listen(port ?? 3000);

    app.enableShutdownHooks();

    logger.log(
      `🚀 Application is running on: http://localhost:${port}/v${defaultApiVersion}/${globalPrefix}/swagger`
    );
  } catch (err) {
    logger.error('Failed to start server', err);
    throw err;
  }
}

bootstrap();

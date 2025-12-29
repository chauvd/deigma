import { Module, DynamicModule, Global, ClassProvider } from '@nestjs/common';
import { BaseConfigurationService } from './configuration.service';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

@Global()
@Module({})
export class ConfigurationModule {
  static register(options: { useClass: ClassProvider['useClass'] }): DynamicModule {
    return {
      module: ConfigurationModule,
      global: true,
      imports: [
        NestConfigModule.forRoot({
          cache: false,
        }),
      ],
      providers: [
        {
          provide: BaseConfigurationService,
          useClass: options.useClass,
        },
        {
          provide: options.useClass,
          useExisting: BaseConfigurationService,
        },
      ],
      exports: [BaseConfigurationService, options.useClass],
    };
  }
}
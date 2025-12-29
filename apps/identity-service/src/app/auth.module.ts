import { ConfigurationModule } from '@deigma/configuration';
import { Global, Module } from '@nestjs/common';
import { ConfigurationService } from '../configuration/configuration.service';
import { KeycloakOidcAuthModule } from '@deigma/authentication-keycloak';

@Global()
@Module({
  imports: [
    KeycloakOidcAuthModule.registerAsync({
      imports: [ConfigurationModule],
      useFactory: (configService: ConfigurationService) => ({
        issuerBaseUrl: configService.issuerBaseUrl,
        audience: configService.appAudience,
      }),
      inject: [ConfigurationService],
    }),
  ],
})
export class AppAuthModule {}

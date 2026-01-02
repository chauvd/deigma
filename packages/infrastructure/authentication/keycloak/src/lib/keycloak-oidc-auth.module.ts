import {
  OIDC_PROVIDER_ADAPTER,
  OidcJwtAuthModule,
  type OidcJwtAuthAsyncOptions,
  type OidcJwtAuthOptions,
} from '@deigma/authentication-core';
import { DynamicModule, Module } from '@nestjs/common';
import { createKeycloakAdapter } from './keycloak.adapter';

@Module({})
export class KeycloakOidcAuthModule {
  static register(options: OidcJwtAuthOptions): DynamicModule {
    return OidcJwtAuthModule.register(options, createKeycloakAdapter());
  }

  static registerAsync(options: OidcJwtAuthAsyncOptions): DynamicModule {
    return OidcJwtAuthModule.registerAsync(options, {
      provide: OIDC_PROVIDER_ADAPTER,
      useFactory: () => createKeycloakAdapter(),
    });
  }
}

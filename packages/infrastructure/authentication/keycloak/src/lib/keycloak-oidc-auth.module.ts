import { DynamicModule, Module } from '@nestjs/common';
import {
  OidcJwtAuthModule,
  OIDC_PROVIDER_ADAPTER,
  type OidcJwtAuthAsyncOptions,
  type OidcJwtAuthOptions,
} from '@deigma/authentication-core';
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

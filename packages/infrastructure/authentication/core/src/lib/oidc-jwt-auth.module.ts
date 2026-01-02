import { HttpModule } from '@nestjs/axios';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwksService } from './jwks.service';
import { OidcDiscoveryService } from './oidc-discovery.service';
import { OidcJwtAuthGuard } from './oidc-jwt-auth.guard';
import { OidcJwtStrategy } from './oidc-jwt.strategy';
import {
  OidcJwtAuthAsyncOptions,
  OidcJwtAuthOptions,
  OidcJwtAuthOptionsFactory,
} from './options';
import type { OidcProviderAdapter } from './provider-adapter';
import { OIDC_JWT_AUTH_OPTIONS, OIDC_PROVIDER_ADAPTER } from './tokens';

@Module({})
export class OidcJwtAuthModule {
  static register(
    options: OidcJwtAuthOptions,
    adapter: OidcProviderAdapter
  ): DynamicModule {
    return {
      module: OidcJwtAuthModule,
      imports: [
        HttpModule,
        PassportModule.register({ defaultStrategy: 'oidc-jwt' }),
        JwtModule.register({}),
      ],
      providers: [
        { provide: OIDC_JWT_AUTH_OPTIONS, useValue: normalize(options) },
        { provide: OIDC_PROVIDER_ADAPTER, useValue: adapter },
        OidcDiscoveryService,
        JwksService,
        OidcJwtStrategy,
        OidcJwtAuthGuard,
      ],
      exports: [OidcJwtAuthGuard],
    };
  }

  static registerAsync(
    options: OidcJwtAuthAsyncOptions,
    adapterProvider: Provider
  ): DynamicModule {
    return {
      module: OidcJwtAuthModule,
      imports: [
        HttpModule,
        ...(options.imports ?? []),
        PassportModule.register({ defaultStrategy: 'oidc-jwt' }),
        JwtModule.register({}),
      ],
      providers: [
        ...this.createAsyncProviders(options),
        adapterProvider,
        OidcDiscoveryService,
        JwksService,
        OidcJwtStrategy,
        OidcJwtAuthGuard,
      ],
      exports: [OidcJwtAuthGuard],
    };
  }

  private static createAsyncProviders(
    options: OidcJwtAuthAsyncOptions
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: OIDC_JWT_AUTH_OPTIONS,
          useFactory: async (...args: any[]) =>
            normalize(await options.useFactory!(...args)),
          inject: options.inject ?? [],
        },
      ];
    }

    const inject = [options.useExisting ?? options.useClass] as any[];

    return [
      {
        provide: OIDC_JWT_AUTH_OPTIONS,
        useFactory: async (factory: OidcJwtAuthOptionsFactory) =>
          normalize(await factory.createOidcJwtAuthOptions()),
        inject,
      },
      ...(options.useClass
        ? [{ provide: options.useClass, useClass: options.useClass }]
        : []),
    ];
  }
}

function normalize(opts: OidcJwtAuthOptions): OidcJwtAuthOptions {
  return {
    allowMultiAudience: true,
    allowedAlgorithms: ['RS256'],
    jwksCacheTtlMs: 10 * 60_000,
    httpTimeoutMs: 3000,
    clockToleranceSec: 5,
    required: true,
    ...opts,
    issuerBaseUrl: (opts.issuerBaseUrl ?? '').replace(/\/$/, ''),
    audience: String(opts.audience),
  };
}

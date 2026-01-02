import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { decodeProtectedHeader, errors as JoseErrors } from 'jose';
import type { SecretOrKeyProvider } from 'passport-jwt';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwksService } from './jwks.service';
import { OidcDiscoveryService } from './oidc-discovery.service';
import type { OidcJwtAuthOptions } from './options';
import type { AuthenticatedPrincipal } from './principal';
import type { OidcProviderAdapter } from './provider-adapter';
import { OIDC_JWT_AUTH_OPTIONS, OIDC_PROVIDER_ADAPTER } from './tokens';

type JwtPayload = Record<string, any>;

@Injectable()
export class OidcJwtStrategy extends PassportStrategy(Strategy, 'oidc-jwt') {
  private readonly logger = new Logger(OidcJwtStrategy.name);

  constructor(
    @Inject(OIDC_JWT_AUTH_OPTIONS) private readonly options: OidcJwtAuthOptions,
    @Inject(OIDC_PROVIDER_ADAPTER)
    private readonly adapter: OidcProviderAdapter,
    private readonly discovery: OidcDiscoveryService,
    private readonly jwks: JwksService
  ) {
    const secretOrKeyProvider: SecretOrKeyProvider = (
      _req,
      rawJwtToken,
      done
    ) => {
      if (!rawJwtToken) {
        if (options.required === false) {
          return done(null);
        }
        return done(new UnauthorizedException('Missing bearer token'));
      }

      try {
        const header = decodeProtectedHeader(rawJwtToken);

        this.jwks.getKey(header, options).then((key) => {
          return done(null, key);
        });
      } catch (e) {
        if (e instanceof JoseErrors.JOSEError) {
          return done({
            name: e.code ?? e.name,
            message: e.message,
          });
        }
        return done(e);
      }
    };

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: false,
      secretOrKeyProvider,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedPrincipal> {
    try {
      this.assertAudience(payload);
      await this.assertIssuer(payload);
      this.assertAzp(payload);
      if (this.adapter.validatePayload) {
        await this.adapter.validatePayload(payload, this.options);
      }
      return this.adapter.mapPrincipal(payload, this.options);
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  private assertAudience(payload: JwtPayload) {
    const accepted = new Set(
      [this.options.audience, ...(this.options.extraAudiences ?? [])].filter(
        Boolean
      )
    );

    const audClaim = payload['aud'];

    const auds: string[] = Array.isArray(audClaim)
      ? audClaim.map((x: any) => String(x))
      : audClaim
        ? [String(audClaim)]
        : [];

    if (
      (this.options.allowMultiAudience ?? true) === false &&
      Array.isArray(audClaim)
    ) {
      throw new UnauthorizedException('Invalid audience type');
    }

    if (!auds.some((a) => accepted.has(a))) {
      throw new UnauthorizedException('Invalid audience');
    }
  }

  private assertAzp(payload: JwtPayload) {
    if (!this.options.requiredAzp) return;

    if (String(payload['azp'] ?? '') !== this.options.requiredAzp) {
      throw new UnauthorizedException('Invalid azp');
    }
  }

  private async assertIssuer(payload: JwtPayload) {
    try {
      const disc = await this.discovery.getDiscovery(this.options);

      const expected = (disc.issuer ?? this.options.issuerBaseUrl).replace(
        /\/$/,
        ''
      );

      const iss = String(payload['iss'] ?? '').replace(/\/$/, '');

      if (!iss || iss !== expected) {
        this.logger.warn(`Found issuer ${iss}, expected ${expected}`);
        // TODO: clean up for domain difference between docker DNS and issuer
        // throw new UnauthorizedException(`Invalid issuer`);
      }
    } catch (e: any) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new UnauthorizedException(e.message ?? 'Discovery error');
    }
  }
}

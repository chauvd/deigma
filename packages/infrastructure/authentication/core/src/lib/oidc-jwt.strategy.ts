import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { JWTHeaderParameters } from 'jose';
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
constructor(
    @Inject(OIDC_JWT_AUTH_OPTIONS) private readonly options: OidcJwtAuthOptions,
    @Inject(OIDC_PROVIDER_ADAPTER) private readonly adapter: OidcProviderAdapter,
    private readonly discovery: OidcDiscoveryService,
    private readonly jwks: JwksService,
  ) {
    const secretOrKeyProvider: SecretOrKeyProvider = (_req, rawJwtToken, done) => {
      if (!rawJwtToken) {
        if (options.required === false) return done(null, undefined);
        return done(new UnauthorizedException('Missing bearer token'), undefined);
      }

      // NOTE: must not be `async` (passport-jwt expects callback-style)
      (async () => {
        try {
          const [encodedHeader] = rawJwtToken.split('.');
          const headerJson = Buffer.from(encodedHeader, 'base64url').toString('utf8');
          const header = JSON.parse(headerJson) as JWTHeaderParameters;

          const key = await this.jwks.getKey(header, options);

          // passport-jwt types usually only allow string|Buffer, but runtime supports key objects.
          // Cast to satisfy TS.
          done(null, key as unknown as any);
        } catch (e) {
          done(e as any, undefined);
        }
      })();

      return; // explicit void
    };

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      passReqToCallback: false,
      secretOrKeyProvider,
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedPrincipal> {
    this.assertAudience(payload);
    await this.assertIssuer(payload);
    this.assertAzp(payload);

    if (this.adapter.validatePayload) await this.adapter.validatePayload(payload, this.options);
    return this.adapter.mapPrincipal(payload, this.options);
  }

  private assertAudience(payload: JwtPayload) {
    const accepted = new Set([this.options.audience, ...(this.options.extraAudiences ?? [])].filter(Boolean));
    const audClaim = payload['aud'];

    const auds: string[] = Array.isArray(audClaim)
      ? audClaim.map((x: any) => String(x))
      : audClaim
        ? [String(audClaim)]
        : [];

    if ((this.options.allowMultiAudience ?? true) === false && Array.isArray(audClaim)) {
      throw new UnauthorizedException('Invalid audience type');
    }
    if (!auds.some(a => accepted.has(a))) throw new UnauthorizedException('Invalid audience');
  }

  private assertAzp(payload: JwtPayload) {
    if (!this.options.requiredAzp) return;
    if (String(payload['azp'] ?? '') !== this.options.requiredAzp) throw new UnauthorizedException('Invalid azp');
  }

  private async assertIssuer(payload: JwtPayload) {
    const disc = await this.discovery.getDiscovery(this.options);
    const expected = (disc.issuer ?? this.options.issuerBaseUrl).replace(/\/$/, '');
    const iss = String(payload['iss'] ?? '').replace(/\/$/, '');
    if (!iss || iss !== expected) throw new UnauthorizedException('Invalid issuer');
  }
}

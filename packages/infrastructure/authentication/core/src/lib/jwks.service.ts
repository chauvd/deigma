import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout, map } from 'rxjs';
import { importJWK, type JWK, errors as JoseErrors } from 'jose';
import type { CryptoKey, JWTHeaderParameters } from 'jose';

import type { OidcJwtAuthOptions } from './options';
import { OidcDiscoveryService } from './oidc-discovery.service';

type JsonWebKeySet = { keys: (JWK & { kid?: string; alg?: string; use?: string })[] };

@Injectable()
export class JwksService {
  private cache?: { jwksUri: string; value: JsonWebKeySet; expiresAt: number };

  constructor(private readonly http: HttpService, private readonly discovery: OidcDiscoveryService) {}

  async getKey(header: JWTHeaderParameters, options: OidcJwtAuthOptions): Promise<CryptoKey | Uint8Array> {
    const kid = header.kid;
    if (!kid) {
      throw new JoseErrors.JWTInvalid('JWT header missing kid');
    }

    const { jwks_uri } = await this.discovery.getDiscovery(options);
    const jwks = await this.getJwks(jwks_uri, options);

    const jwk = jwks.keys.find(k => k.kid === kid);
    if (!jwk) {
      // force refresh once (covers key rotation between cache windows)
      this.cache = undefined;
      const fresh = await this.getJwks(jwks_uri, options);
      const freshJwk = fresh.keys.find(k => k.kid === kid);
      if (!freshJwk) throw new JoseErrors.JWKSNoMatchingKey();
      return this.importKey(freshJwk, header);
    }

    return this.importKey(jwk, header);
  }

  private async importKey(jwk: JWK, header: JWTHeaderParameters): Promise<CryptoKey | Uint8Array> {
    const alg = typeof header.alg === 'string' ? header.alg : undefined;
    return importJWK(jwk, alg);
  }

  private async getJwks(jwksUri: string, options: OidcJwtAuthOptions): Promise<JsonWebKeySet> {
    const ttl = options.jwksCacheTtlMs ?? 10 * 60_000;
    const now = Date.now();
    if (this.cache && this.cache.jwksUri === jwksUri && this.cache.expiresAt > now) return this.cache.value;

    const httpTimeoutMs = options.httpTimeoutMs ?? 3000;
    const value = await firstValueFrom(
      this.http.get(jwksUri, { headers: { accept: 'application/json' } }).pipe(
        timeout({ each: httpTimeoutMs }),
        map(res => res.data as JsonWebKeySet),
        map(j => {
          if (!j?.keys || !Array.isArray(j.keys)) throw new Error('Invalid JWKS response');
          return j;
        }),
      ),
    );

    this.cache = { jwksUri, value, expiresAt: now + ttl };
    return value;
  }
}

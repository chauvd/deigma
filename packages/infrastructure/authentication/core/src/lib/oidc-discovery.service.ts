import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, timeout, map } from 'rxjs';
import type { OidcJwtAuthOptions } from './options';

export type OidcDiscovery = { issuer: string; jwks_uri: string };

@Injectable()
export class OidcDiscoveryService {
  private readonly logger = new Logger(OidcDiscoveryService.name);
  private cache?: { key: string; value: OidcDiscovery; expiresAt: number };

  constructor(private readonly http: HttpService) {}

  async getDiscovery(opts: OidcJwtAuthOptions): Promise<OidcDiscovery> {
    const ttl = opts.jwksCacheTtlMs ?? 10 * 60_000;
    const now = Date.now();
    const key = (opts.issuerBaseUrl ?? '').replace(/\/$/, '');

    if (this.cache && this.cache.key === key && this.cache.expiresAt > now) {
      return this.cache.value;
    }

    const url = `${key}/.well-known/openid-configuration`;
    const httpTimeoutMs = opts.httpTimeoutMs ?? 3000;

    try {
      const value = await firstValueFrom(
        this.http.get(url, { headers: { accept: 'application/json' } }).pipe(
          timeout({ each: httpTimeoutMs }),
          map((res) => res.data as Partial<OidcDiscovery>),
          map((json) => {
            if (!json.issuer || !json.jwks_uri)
              throw new Error('OIDC discovery missing issuer/jwks_uri');
            return {
              issuer: json.issuer,
              jwks_uri: json.jwks_uri,
            } as OidcDiscovery;
          })
        )
      );
      this.cache = { key, value, expiresAt: now + ttl };
      return value;
    } catch (e: any) {
      this.logger.error(`OIDC discovery error: ${e?.message ?? e}`);
      throw e;
    }
  }
}

import { Injectable } from '@nestjs/common';
import {
  createRemoteJWKSet,
  exportSPKI,
  errors as JoseErrors,
  ProtectedHeaderParameters,
} from 'jose';
import { OidcDiscoveryService } from './oidc-discovery.service';
import type { OidcJwtAuthOptions } from './options';

@Injectable()
export class JwksService {
  private remoteJWKSet?: any;

  constructor(private readonly discovery: OidcDiscoveryService) {}

  async getKey(
    header: ProtectedHeaderParameters,
    options: OidcJwtAuthOptions
  ): Promise<string> {
    const kid = header.kid;
    if (!kid) {
      throw new JoseErrors.JWTInvalid('JWT header missing kid');
    }

    if (!this.remoteJWKSet) {
      const { jwks_uri } = await this.discovery.getDiscovery(options);
      this.remoteJWKSet = createRemoteJWKSet(new URL(jwks_uri));
    }

    const keyLike = await this.remoteJWKSet(header);

    return await exportSPKI(keyLike);
  }
}

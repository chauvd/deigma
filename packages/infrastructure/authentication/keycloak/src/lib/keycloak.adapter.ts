import {
  DefaultAuthenticatedPrincipal,
  type AuthenticatedPrincipal,
  type OidcJwtAuthOptions,
  type OidcProviderAdapter,
} from '@deigma/authentication-core';

export function createKeycloakAdapter(): OidcProviderAdapter {
  return {
    name: 'keycloak',
    mapPrincipal(
      payload: Record<string, any>,
      _options: OidcJwtAuthOptions
    ): AuthenticatedPrincipal {
      const aud = Array.isArray(payload['aud'])
        ? payload['aud'].map(String)
        : payload['aud']
          ? [String(payload['aud'])]
          : [];

      const realmRoles: string[] = payload?.['realm_access']?.roles ?? [];
      const resourceRoles: string[] = payload?.['resource_access']
        ? Object.values(payload['resource_access']).flatMap(
            (v: any) => v?.roles ?? []
          )
        : [];

      const roles = Array.from(
        new Set([...(realmRoles ?? []), ...(resourceRoles ?? [])])
      ).filter(Boolean);

      const username = payload['preferred_username'] ?? payload['username'];
      const email = payload['email'];
      const name =
        payload['name'] ??
        [payload['given_name'], payload['family_name']]
          .filter(Boolean)
          .join(' ') ??
        undefined;

      const principal = new DefaultAuthenticatedPrincipal(
        String(payload['sub']),
        String(payload['iss']),
        aud,
        username ? String(username) : undefined,
        email ? String(email) : undefined,
        name ? String(name) : undefined,
        roles,
        payload
      );

      return principal;
    },
  };
}

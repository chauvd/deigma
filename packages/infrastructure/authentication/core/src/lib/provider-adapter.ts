import type { AuthenticatedPrincipal } from './principal';
import type { OidcJwtAuthOptions } from './options';

export interface OidcProviderAdapter {
  readonly name: string;
  mapPrincipal(
    payload: Record<string, any>,
    options: OidcJwtAuthOptions
  ): AuthenticatedPrincipal;
  validatePayload?(
    payload: Record<string, any>,
    options: OidcJwtAuthOptions
  ): void | Promise<void>;
}

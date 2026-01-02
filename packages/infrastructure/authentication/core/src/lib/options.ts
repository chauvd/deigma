import { ModuleMetadata, Type } from '@nestjs/common';

export type MaybePromise<T> = T | Promise<T>;

export interface OidcJwtAuthOptions {
  issuerBaseUrl: string;
  audience: string;
  extraAudiences?: string[];
  allowMultiAudience?: boolean;
  requiredAzp?: string;
  allowedAlgorithms?: string[];
  clockToleranceSec?: number;
  jwksCacheTtlMs?: number;
  httpTimeoutMs?: number;
  required?: boolean;
}

export interface OidcJwtAuthOptionsFactory {
  createOidcJwtAuthOptions(): MaybePromise<OidcJwtAuthOptions>;
}

export interface OidcJwtAuthAsyncOptions extends Pick<
  ModuleMetadata,
  'imports'
> {
  useExisting?: Type<OidcJwtAuthOptionsFactory>;
  useClass?: Type<OidcJwtAuthOptionsFactory>;
  useFactory?: (...args: any[]) => MaybePromise<OidcJwtAuthOptions>;
  inject?: any[];
}

export interface AuthenticatedPrincipal {
  subject: string;
  issuer: string;
  audience: string[];
  username?: string;
  email?: string;
  name?: string;
  roles: string[];
  raw: Record<string, any>;
}

export class DefaultAuthenticatedPrincipal implements AuthenticatedPrincipal {
  constructor(
    public readonly subject: string,
    public readonly issuer: string,
    public readonly audience: string[],
    public readonly username: string | undefined,
    public readonly email: string | undefined,
    public readonly name: string | undefined,
    public readonly roles: string[],
    public readonly raw: Record<string, any>,
  ) {}
}

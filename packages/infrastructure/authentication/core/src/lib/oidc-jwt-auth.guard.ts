import {
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from './public.decorator';

@Injectable()
export class OidcJwtAuthGuard extends AuthGuard('oidc-jwt') {
  private readonly logger = new Logger(OidcJwtAuthGuard.name);

  constructor(private readonly reflector: Reflector) {
    super();
  }

  override handleRequest(err: any, user: any, info: any) {
    if (err) {
      this.logger.error(err);
      throw err;
    }
    if (!user) {
      this.logger.warn(info);
      throw new UnauthorizedException(info?.message ?? 'Unauthorized');
    }
    return user;
  }

  override canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;
    return super.canActivate(context);
  }
}

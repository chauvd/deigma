# Role → Permission Patterns

This document shows practical examples for the approach described earlier: **keep JWTs small (roles/scopes only)** and do **role → permission expansion server-side**. It contains:

* a NestJS + CASL pattern (with JWT) showing how to expand roles to permissions using a cached mapping
* Mongoose document models for roles and permissions
* an example Keycloak Authorization Services JSON pattern and notes

---

## 1) High-level flow

1. Client obtains a small JWT from Keycloak containing user id and roles (or scopes).
2. API gateway / NestJS service reads `roles` from the token.
3. The service uses a `RoleService` (cached) to expand roles → permissions.
4. CASL `Ability` is built from the permission list and used by guards.

---

## 2) NestJS + CASL + JWT pattern

### Package dependencies (example)

```json
{
  "dependencies": {
    "@nestjs/common": "*",
    "@nestjs/core": "*",
    "@nestjs/jwt": "*",
    "passport": "*",
    "passport-jwt": "*",
    "@casl/ability": "*",
    "mongoose": "*",
    "cache-manager": "*"
  }
}
```

### `role-permission.service.ts` — role → permission expansion with cache

```ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// simple in-memory cache; replace with Redis for multi-instance
interface RoleMapping {
  role: string;
  permissions: string[]; // e.g. ['file:read', 'file:write']
}

@Injectable()
export class RolePermissionService implements OnModuleInit {
  private readonly logger = new Logger(RolePermissionService.name);
  private cache = new Map<string, string[]>();
  private readonly TTL_MS = 30_000; // refresh every 30s

  constructor(@InjectCollection('Role') private roleModel: Model<any>) {}

  async onModuleInit() {
    await this.refreshCache();
    setInterval(() => this.refreshCache().catch(err => this.logger.error(err)), this.TTL_MS);
  }

  private async refreshCache() {
    const roles = await this.roleModel.find().lean();
    const newCache = new Map<string, string[]>();
    for (const r of roles) {
      newCache.set(r.name, r.permissions || []);
    }
    this.cache = newCache;
    this.logger.debug(`Role cache refreshed: ${this.cache.size} entries`);
  }

  expandRolesToPermissions(roles: string[]): string[] {
    const perms = new Set<string>();
    for (const r of roles) {
      const list = this.cache.get(r) || [];
      for (const p of list) perms.add(p);
    }
    return Array.from(perms);
  }
}
```

> Replace the simple in-memory `Map` with Redis if you need shared cache between instances.

### `ability.factory.ts` — build CASL `Ability` from permissions

```ts
import { Injectable } from '@nestjs/common';
import { AbilityBuilder, Ability } from '@casl/ability';

type Action = 'read' | 'create' | 'update' | 'delete' | 'manage';

@Injectable()
export class AbilityFactory {
  createForPermissions(permissions: string[]) {
    // permissions are strings like: 'file:read', 'file:write', 'user:*'
    const { can, build } = new AbilityBuilder(Ability as any);

    for (const p of permissions) {
      const [resource, op] = p.split(':');
      if (!resource) continue;
      switch (op) {
        case 'read': can('read' as Action, resource); break;
        case 'write': can('update' as Action, resource); break;
        case 'create': can('create' as Action, resource); break;
        case 'delete': can('delete' as Action, resource); break;
        case '*': can('manage' as Action, resource); break;
        default:
          // support custom mapping or granular ops like read:own etc.
          if (op?.startsWith('read')) can('read' as Action, resource);
      }
    }

    return build({ detectSubjectType: item => (item as any).type });
  }
}
```

### `jwt.strategy.ts` — extract roles from token (Passport-JWT)

```ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_PUBLIC_KEY || 'changeme',
      ignoreExpiration: false,
    });
  }

  async validate(payload: any) {
    // payload contains the small set of claims from Keycloak
    // keycloak may put roles in `realm_access.roles` or `resource_access[client].roles`
    const roles = extractRolesFromPayload(payload);
    return {
      sub: payload.sub,
      userId: payload.sub,
      username: payload.preferred_username || payload.email,
      roles,
      raw: payload,
    };
  }
}

function extractRolesFromPayload(payload: any): string[] {
  // adapt to your Keycloak token shape
  const roles: string[] = [];
  if (payload.realm_access && Array.isArray(payload.realm_access.roles)) {
    roles.push(...payload.realm_access.roles);
  }
  if (payload.resource_access) {
    for (const k of Object.keys(payload.resource_access)) {
      const rs = payload.resource_access[k]?.roles;
      if (Array.isArray(rs)) roles.push(...rs);
    }
  }
  if (payload.scope) {
    // optional: client scopes flattened
    roles.push(...payload.scope.split(' '));
  }
  return Array.from(new Set(roles));
}
```

### `ability.guard.ts` — guard using CASL ability

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AbilityFactory } from './ability.factory';

@Injectable()
export class CheckAbilityGuard implements CanActivate {
  constructor(private reflector: Reflector, private abilityFactory: AbilityFactory) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) return false;

    // read required permission metadata (controller decorated)
    const required = this.reflector.get<string>('permission', context.getHandler());
    if (!required) return true; // no permission declared

    const rolePermService = req.rolePermService as any; // inject via middleware or DI
    const perms = rolePermService.expandRolesToPermissions(user.roles || []);
    const ability = this.abilityFactory.createForPermissions(perms);

    // required could be like 'file:read'
    const [resource, op] = required.split(':');
    const action = mapOpToAction(op);
    return ability.can(action, resource);
  }
}

function mapOpToAction(op: string) {
  switch (op) {
    case 'read': return 'read';
    case 'write': return 'update';
    case 'create': return 'create';
    case 'delete': return 'delete';
    default: return op;
  }
}
```

### `permission.decorator.ts` — declare required permission on handlers

```ts
import { SetMetadata } from '@nestjs/common';
export const RequiresPermission = (perm: string) => SetMetadata('permission', perm);
```

### Example controller usage

```ts
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('files')
export class FilesController {
  @Get()
  @RequiresPermission('file:read')
  @UseGuards(CheckAbilityGuard)
  async list() {
    return { ok: true };
  }
}
```

---

## 3) Modeling Role and Permission docs in MongoDB (Mongoose)

### `role.schema.ts`

```ts
import { Schema } from 'mongoose';

export const RoleSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: { type: [String], default: [] },
  updatedAt: { type: Date, default: Date.now }
});
```

Notes:

* Keep `permissions` as an array of strings `resource:op` — easy to expand in code.
* Optionally normalize permissions into a separate `Permission` collection if you need metadata (display name, category, admin UI flags), but for runtime checks a string-list is simplest and fast.

### Example `Permission` doc (optional)

```ts
export const PermissionSchema = new Schema({
  name: { type: String, required: true, unique: true }, // 'file:read'
  title: { type: String },
  description: { type: String }
});
```

---

## 4) Keycloak — where to put things

### Minimal token contents

* `sub` (user id)
* `preferred_username` / `email`
* `realm_access.roles` and/or `resource_access[client].roles`
* `aud` as needed

**Do not** include full permission lists in the token.

### Keycloak Authorization Services (option)

Keycloak has an Authorization subsystem that allows **policies**, **resources**, and **permissions**. You can model the fine-grained policies in Keycloak and evaluate them at the gateway when needed, but that tends to introduce cross-network calls. A recommended hybrid approach:

* Use Keycloak roles/scopes in the token
* Keep role → permission mapping in your microservices or a central cache
* Use Keycloak policies for very high-assurance checks or administrative UIs

### Example: Representing roles as client scopes

In Keycloak admin, create client scopes for user-facing roles or map `realm roles` into client tokens. This results in tokens with small scope lists, e.g.: `"scope": "profile email file-reader file-editor"`.

If an architecture requires Keycloak to enforce every fine-grained permission, use Keycloak's `Entitlement API` (UMA / permissions endpoint) — but expect network latency and the need for caching.

---

## 5) Operational considerations

* **Cache invalidation:** pick a TTL small enough to reflect permission changes quickly (e.g., 30s–5m) but large enough to avoid thrashing. When an admin changes role permissions, publish an event to services to immediately refresh caches (message bus, Redis pub/sub).
* **Multi-instance:** use Redis for cache if you have multiple API instances.
* **Token expiry:** set access token TTL to balance risk vs UX (e.g., 15m). Since tokens only carry roles, changes propagate quickly once caches are refreshed.
* **Auditing:** log expanded permissions used per request at `debug` level if you need traceability.

---

## 6) Extras and variations

* **Attribute-based checks:** If you need resource ownership checks (e.g., `read:own`), mix CASL ability rules with runtime checks (ownerId === userId).
* **Dynamic ABAC:** store attribute policies in DB and compile into CASL rules on startup or refresh.
* **Admin UI:** show roles and their permission lists; editing updates the DB and publishes a cache invalidation event.

---

If you want, I can also:

* provide a full working NestJS module repository scaffold (main.ts, app.module, providers wired), or
* produce a sample Redis-backed cache snippet and a small `invalidate-cache` endpoint, or
* show a Keycloak `policy` JSON export sample for a single resource.

Tell me which of those you'd like and I’ll add it to this doc.

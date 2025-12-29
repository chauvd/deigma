import { Injectable, Scope } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection, Types } from 'mongoose';
import { EntityId } from './entity.base';

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  private _tenantId!: Types.UUID;

  setTenant(id: EntityId) {
    this._tenantId = typeof id === 'string' ? new Types.UUID(id) : id;
  }

  get tenantId(): Types.UUID {
    return this._tenantId;
  }
}

@Injectable()
export class TransactionManager {
  constructor(
    @InjectConnection()
    private readonly connection: Connection,
  ) { }

  async run<T>(
    handler: (session: ClientSession) => Promise<T>,
  ): Promise<T> {
    const session = await this.connection.startSession();

    try {
      let result!: T;

      await session.withTransaction(async () => {
        result = await handler(session);
      });

      return result;
    } finally {
      await session.endSession();
    }
  }
}
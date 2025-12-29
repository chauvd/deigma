// libs/common-mappers/src/lib/mappers/dynamic-mapper.ts
import { Injectable, Logger } from '@nestjs/common';
import { getFieldMetadata } from './field.decorator';
import { ModuleRef } from '@nestjs/core';

export interface Paginated<T> {
  data: T[];
  total: number;
}

@Injectable()
export class DtoMapper {
  private readonly logger = new Logger(DtoMapper.name)

  constructor(
    private readonly moduleRef: ModuleRef,
  ) { }

  map<T = any>(entity: any, dtoClass: new () => T): T {
    if (!entity) return null as any;

    const dto: any = new dtoClass();
    const metadata = getFieldMetadata(dtoClass);

    // 1️⃣ Apply fields defined on DTO but not present in entity (computed only)
    for (const key of Object.keys(metadata)) {
      const meta = metadata[key];

      // ignore field
      if (meta?.ignore) continue;

      if (meta.computed && dto[key] === undefined) {
        dto[meta.target ?? key] = this.resolveComputed(dto, key, meta, entity);
        continue;
      }

      if (meta?.target) {
        dto[key] = entity[meta.target];
        continue;
      }

      dto[key] = entity[key];
    }

    // 2️⃣ Optional Zod validation (static schema on DTO)
    if ((dtoClass as any).schema) {
      const result = (dtoClass as any).schema.safeParse(dto);
      if (!result.success) {
        this.logger.error(`DTO validation failed: ${result.error}`);
        throw result.error;
      }
      return result.data;
    }

    return dto;
  }

  private resolveComputed(dto: any, key: string, meta: any, entity: any) {
    if (meta?.computed) {
      let value: any;

      if (typeof meta.computed === 'function') {
        // direct inline compute
        value = meta.computed(entity);
      } else {
        // provider + method form
        const instance = this.moduleRef.get(meta.computed.provider, {
          strict: false,
        });

        if (!instance) {
          throw new Error(
            `Provider ${meta.computed.provider.name} not found for computed field.`,
          );
        }

        const fn = instance[meta.computed.method];

        if (typeof fn !== 'function') {
          throw new Error(
            `Method "${meta.computed.method}" is not a function on provider ${meta.computed.provider.name}`,
          );
        }

        value = fn.call(instance, entity);
      }

      dto[meta.targetField ?? key] = value;
    }
  }

  mapArray<T>(entities: any[], dtoClass: new () => T): T[] {
    return entities.map((e) => this.map(e, dtoClass));
  }

  mapPaginated<T>(
    paginated: Paginated<any>,
    dtoClass: new () => T
  ): Paginated<T> {
    return {
      total: paginated.total,
      data: this.mapArray(paginated.data, dtoClass),
    };
  }
}

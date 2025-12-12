// libs/common-mappers/src/lib/mappers/dynamic-reverse-mapper.ts
import { Injectable } from '@nestjs/common';
import { getFieldMetadata } from './field.decorator';

@Injectable()
export class DomainMapper {
  map<T = any>(dto: any, entityClass: new () => T): T {
    if (!dto) return null as any;

    // If DTO has a zod schema for input validation
    if ((dto.constructor as any).schema) {
      const result = (dto.constructor as any).schema.safeParse(dto);
      if (!result.success) {
        throw result.error;
      }
    }

    const entity: any = new entityClass();
    const metadata = getFieldMetadata(dto.constructor);

    for (const key of Object.keys(dto)) {
      const meta = metadata[key];

      if (meta?.ignore) continue;

      if (meta?.target) {
        entity[meta.target] = dto[key];
        continue;
      }

      entity[key] = dto[key];
    }

    return entity;
  }

  mapArray<T>(dtos: any[], entityClass: new () => T): T[] {
    return dtos.map((d) => this.map(d, entityClass));
  }

  mapPaginated<T>(
    paginated: { data: any[]; total: number },
    entityClass: new () => T
  ): { data: T[]; total: number } {
    return {
      total: paginated.total,
      data: this.mapArray(paginated.data, entityClass),
    };
  }
}

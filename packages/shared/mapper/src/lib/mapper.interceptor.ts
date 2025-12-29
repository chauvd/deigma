import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MAP_DTO_KEY } from './map-to.decorator';
import { DtoMapper } from './dto.mapper';
import { Reflector } from '@nestjs/core';

@Injectable()
export class DtoMapperInterceptor implements NestInterceptor {

  constructor(
    private readonly reflector: Reflector,
    private readonly mapper: DtoMapper
  ) { }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const dtoClass = this.reflector.get(MAP_DTO_KEY, context.getHandler());

    if (!dtoClass) return next.handle();

    return next.handle().pipe(
      map(async (result) => {
        if (result == null) return result;

        if (Array.isArray(result)) {
          return this.mapper.mapArray(result, dtoClass);
        }

        if (result.data && Array.isArray(result.data)) {
          return this.mapper.mapPaginated(result, dtoClass);
        }

        return this.mapper.map(result, dtoClass);
      }),
    );
  }
}
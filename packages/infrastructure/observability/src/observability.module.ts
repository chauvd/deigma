import { DynamicModule, Module } from '@nestjs/common';
import { ObservabilityService } from './observability.service';
import { MetricsProvider, TraceProvider } from './providers';

class CompositeObservabilityService extends ObservabilityService {
  constructor(
    private readonly metrics: MetricsProvider[],
    private readonly traces: TraceProvider[],
  ) {
    super();
  }

  counter(name: string, value = 1, labels?: any) {
    this.metrics.forEach(m => m.counter(name, value, labels));
  }

  histogram(name: string, value: number, labels?: any) {
    this.metrics.forEach(m => m.histogram(name, value, labels));
  }

  gauge(name: string, value: number, labels?: any) {
    this.metrics.forEach(m => m.gauge(name, value, labels));
  }

  async span<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const spans = this.traces.map(t => t.startSpan(name));
    try {
      return await fn();
    } catch (e) {
      spans.forEach(s => s.recordException(e as Error));
      throw e;
    } finally {
      spans.forEach(s => s.end());
    }
  }
}

@Module({})
export class ObservabilityModule {
  static forRoot(options: {
    metrics?: MetricsProvider[];
    traces?: TraceProvider[];
  }): DynamicModule {
    return {
      module: ObservabilityModule,
      global: true,
      providers: [
        {
          provide: ObservabilityService,
          useValue: new CompositeObservabilityService(
            options.metrics ?? [],
            options.traces ?? [],
          ),
        },
      ],
      exports: [ObservabilityService],
    };
  }
}
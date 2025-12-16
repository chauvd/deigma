import { MetricLabels } from './observability.service';

export interface MetricsProvider {
  counter(name: string, value: number, labels?: MetricLabels): void;
  histogram(name: string, value: number, labels?: MetricLabels): void;
  gauge(name: string, value: number, labels?: MetricLabels): void;
}

export interface TraceSpan {
  recordException(error: Error): void;
  end(): void;
}

export interface TraceProvider {
  startSpan(name: string): TraceSpan;
}
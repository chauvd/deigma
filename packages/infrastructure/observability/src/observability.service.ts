export type MetricLabels = Record<string, string | number | boolean>;

export abstract class ObservabilityService {
  abstract counter(name: string, value?: number, labels?: MetricLabels): void;
  abstract histogram(name: string, value: number, labels?: MetricLabels): void;
  abstract gauge(name: string, value: number, labels?: MetricLabels): void;
  abstract span<T>(name: string, fn: () => Promise<T>): Promise<T>;
}
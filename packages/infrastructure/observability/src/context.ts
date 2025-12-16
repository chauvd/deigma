import { AsyncLocalStorage } from 'async_hooks';

export class ObservabilityContext {
  private static storage = new AsyncLocalStorage<Map<string, unknown>>();

  static run<T>(ctx: Map<string, unknown>, fn: () => T): T {
    return this.storage.run(ctx, fn);
  }

  static get<T = unknown>(key: string): T | undefined {
    return this.storage.getStore()?.get(key) as T | undefined;
  }
}
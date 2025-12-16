import { ObservabilityModule } from "@deigma/observability";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
  imports: [
    ObservabilityModule.forRoot({
      traces: [],
      metrics: [],
    }),
  ]
})
export class AppObservabilityModule { };

import { Public } from '@deigma/authentication-core';
import { ILogger } from '@deigma/logging';
import { Controller, Get, Inject } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        @Inject(ILogger) private readonly logger: ILogger,
        private health: HealthCheckService,
        private memoryHealthIndicator: MemoryHealthIndicator
    ) { }

    @Get()
    @Public()
    @HealthCheck()
    check() {
        this.logger.info('Health check requested');
        return this.health.check([
            // the process should not use more than 300MB memory
            () =>
                this.memoryHealthIndicator.checkHeap('memory heap', 300 * 1024 * 1024),
            // The process should not have more than 300MB RSS memory allocated
            () =>
                this.memoryHealthIndicator.checkRSS('memory RSS', 300 * 1024 * 1024)
        ]);
    }
}

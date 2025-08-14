import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';

@Controller()
export class AppController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly http: HttpHealthIndicator
    ) {}

    @Get('health')
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck('server', 'http://smoothstyle-dev.space'),
            () => this.http.pingCheck('vault', 'http://smoothstyle-dev.space:8200'),
        ]);
    }
}

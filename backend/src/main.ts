import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import * as process from 'node:process';

async function bootstrap() {
    const PORT = process.env.PORT || 8080;

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );
    app.setGlobalPrefix('api');

    await app.listen(PORT, '0.0.0.0');
}

bootstrap();

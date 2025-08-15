import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { VaultClient } from './config/vault.client';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const vaultClient = new VaultClient();
    const secrets = await vaultClient.readSecrets();

    const PORT = secrets.SERVER_PORT || 8080;

    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule.forRoot(secrets),
        new FastifyAdapter(),
    );
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    await app.listen(PORT, '0.0.0.0');
    console.log('Listening on port ' + PORT);
}

bootstrap();

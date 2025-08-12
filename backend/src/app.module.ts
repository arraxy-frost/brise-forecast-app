import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { VaultModule } from './config/vault/vault.module';
import { WeatherModule } from './modules/weather/weather.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        VaultModule.forRootFromEnv(),
        WeatherModule,
    ],
    controllers: [AppController],
})
export class AppModule {}

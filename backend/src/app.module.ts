import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WeatherModule } from './modules/weather/weather.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './enitites/user.entity';

@Module({})
export class AppModule {
    static forRoot(secrets: Record<string, string>): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [() => secrets],
                }),
                TypeOrmModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: (config: ConfigService) => ({
                        type: 'postgres',
                        host: config.get<string>('DB_HOST'),
                        port: Number(config.get<string>('DB_PORT')),
                        username: config.get<string>('DB_USER'),
                        password: config.get<string>('DB_PASS'),
                        database: config.get<string>('DB_NAME'),
                        autoLoadEntities: true,
                        synchronize: true,
                        entities: [User]
                    }),
                }),
                WeatherModule,
                UsersModule,
                AuthModule
            ],
            controllers: [AppController],
        };
    }
}

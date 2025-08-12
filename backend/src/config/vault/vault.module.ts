import { DynamicModule, Global, Module } from '@nestjs/common';
import { VaultService } from './vault.service';
import * as process from 'node:process';

export interface VaultModuleOptions {
    endpoint: string;
    token: string;
    apiVersion: string;
    vaultName: string;
    environment: string;
}

@Global()
@Module({})
export class VaultModule {
    static forRootFromEnv(): DynamicModule {
        const apiVersion = process.env.VAULT_API_VERSION || 'v1';
        const environment = process.env.NODE_ENV || 'development';
        const endpoint = process.env.VAULT_ADDR;
        const token = process.env.VAULT_TOKEN;
        const vaultName = process.env.VAULT_NAME;

        if (!endpoint || !token || !vaultName) {
            throw new Error(
                '\n❌ [VaultModule] Missing configuration\n' +
                'Please set VAULT_ADDR, VAULT_TOKEN and VAULT_NAME in your .env file.\n'
            );
        }

        return {
            module: VaultModule,
            providers: [
                {
                    provide: 'VAULT_OPTIONS',
                    useValue: { endpoint, token, apiVersion, vaultName, environment } as VaultModuleOptions,
                },
                VaultService,
            ],
            exports: [VaultService],
        };
    }
}

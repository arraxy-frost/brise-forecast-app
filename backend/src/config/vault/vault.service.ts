import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import vault from 'node-vault';
import type { VaultModuleOptions } from './vault.module';

@Injectable()
export class VaultService implements OnModuleInit {
    private client: ReturnType<typeof vault>;

    constructor(
        @Inject('VAULT_OPTIONS') private readonly options: VaultModuleOptions,
    ) {
        console.log(options);
    }

    async onModuleInit() {
        this.client = vault({
            endpoint: this.options.endpoint,
            token: this.options.token,
        });
    }

    async getSecret(path: string): Promise<Record<string, any>> {
        const result = await this.client.read(path);
        return result.data || {};
    }

    async writeSecret(path: string, data: Record<string, any>) {
        await this.client.write(path, data);
    }
}

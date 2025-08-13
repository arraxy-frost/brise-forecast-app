import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import vault from 'node-vault';
import type { VaultModuleOptions } from './vault.module';

@Injectable()
export class VaultService implements OnModuleInit {
    private readonly SECRET_PATH: string;
    private readonly logger = new Logger(VaultService.name);

    private secrets: Record<string, string>;
    private client: ReturnType<typeof vault>;
    private loadPromise: Promise<void>;

    constructor(
        @Inject('VAULT_OPTIONS') private readonly options: VaultModuleOptions,
    ) {
        this.SECRET_PATH = `secret/data/${options.vaultName}/${options.environment}`;
        this.logger.debug('Set Secret PATH', this.SECRET_PATH);
    }

    async onModuleInit() {
        this.client = vault({
            apiVersion: this.options.apiVersion,
            endpoint: this.options.endpoint,
            token: this.options.token,
        });

        this.logger.debug('Starting vault service with options:', this.options);

        this.loadPromise = this.loadSecrets();
    }

    private async loadSecrets() {
        const vaultSecrets = await this.client.read(this.SECRET_PATH);
        const { data } = vaultSecrets.data;
        this.secrets = data;
        this.logger.debug('✅ Secrets loaded from Vault');
    }

    private async ensureLoaded() {
        if (!this.secrets) {
            await this.loadPromise;
        }
    }

    async get(key: string): Promise<string> {
        await this.ensureLoaded();
        return this.secrets[key];
    }

    async getAll(): Promise<Record<string, string>> {
        await this.ensureLoaded();
        return { ...this.secrets };
    }
}

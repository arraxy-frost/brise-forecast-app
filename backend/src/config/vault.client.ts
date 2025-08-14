import vault from 'node-vault';
import * as dotenv from 'dotenv';

dotenv.config();

export class VaultClient {
    private readonly SECRET_PATH: string;

    private secrets: Record<string, string>;
    private client: ReturnType<typeof vault>;
    private loadPromise: Promise<void>;

    constructor() {
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

        this.SECRET_PATH = `secret/data/${vaultName}/${environment}`;

        this.client = vault({
            apiVersion,
            endpoint,
            token,
        });

        this.loadPromise = this.loadSecrets();
    }

    private async loadSecrets() {
        const vaultSecrets = await this.client.read(this.SECRET_PATH);
        const { data } = vaultSecrets.data;
        this.secrets = data;
    }

    private async ensureLoaded() {
        if (!this.secrets) {
            await this.loadPromise;
        }
    }

    async readSecrets(): Promise<Record<string, string>> {
        await this.ensureLoaded();
        return { ...this.secrets };
    }
}

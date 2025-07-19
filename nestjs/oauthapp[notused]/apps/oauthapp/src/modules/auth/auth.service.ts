import { Injectable } from '@nestjs/common';
import { ConfidentialClientApplication, Configuration } from '@azure/msal-node';
import { ManagedIdentityCredential } from '@azure/identity';

@Injectable()
export class AuthService {
    private msalClient: ConfidentialClientApplication;
    private msalConfig: Configuration;

    constructor() {
        this.initialize();
    }

    private async initialize() {
        if (process.env.AZURE_CLIENT_SECRET && process.env.AZURE_CLIENT_SECRET.length > 0) {
            this.msalConfig = {
                auth: {
                    clientId: process.env.AZURE_CLIENT_ID || (() => { throw new Error('AZURE_CLIENT_ID is not defined'); })(),
                    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
                    clientSecret: process.env.AZURE_CLIENT_SECRET,
                },
                system: {
                    loggerOptions: {
                    loggerCallback(loglevel, message) {
                        console.log(message);
                    },
                    piiLoggingEnabled: false,
                    logLevel: 2,
                    },
                },
            };
        } else {
            const managedIdentityCredential = new ManagedIdentityCredential(
                process.env.MANAGED_IDENTITY_CLIENT_ID ? { clientId: process.env.MANAGED_IDENTITY_CLIENT_ID } : undefined
            );
            const tokenResponse = await managedIdentityCredential.getToken(["api://AzureADTokenExchange"]);
            if (tokenResponse && tokenResponse.token) {
                console.log("Authorization Step0: Token Issued by Managed Identity: " + tokenResponse.token);
            }

            this.msalConfig = {
                auth: {
                    clientId: process.env.AZURE_CLIENT_ID || (() => { throw new Error('AZURE_CLIENT_ID is not defined'); })(),
                    authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
                    clientAssertion: tokenResponse.token,
                },
                system: {
                    loggerOptions: {
                    loggerCallback(loglevel, message) {
                        console.log(message);
                    },
                    piiLoggingEnabled: false,
                    logLevel: 2,
                    },
                },
            };
        }

        this.msalClient = new ConfidentialClientApplication(this.msalConfig);
    }

    getClient() {
        return this.msalClient;
    }
}

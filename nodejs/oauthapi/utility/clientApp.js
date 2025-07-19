// It represents your Entra Id App Registration

import { ConfidentialClientApplication, LogLevel } from '@azure/msal-node';
import { ManagedIdentityCredential } from '@azure/identity';

class ClientApp {
    // Private static instance
    static #instance;

    // Private constructor to prevent direct instantiation
    constructor() {
        if (ClientApp.#instance) {
            throw new Error('Use ClientApp.getInstance()');
        }
        // Placeholder for the client application, will be set in init
        this.client = null;
    }

    // Public static method to get the instance
    static async getInstance(accessMethod) {
        if (!ClientApp.#instance) {
            ClientApp.#instance = new ClientApp();
            await ClientApp.#instance.init(accessMethod);
        }
        return ClientApp.#instance;
    }

    static destroy(){
        ClientApp.#instance = null;
    }

    // Async initialization method
    async init(accessMethod) {
        let msalConfig;

        try {
            // In development environment, use CLIENT_SECRET
            if (accessMethod.toUpperCase() === "CS") {
                msalConfig = {
                    auth: {
                        clientId: process.env.AZURE_CLIENT_ID,
                        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
                        clientSecret: process.env.AZURE_CLIENT_SECRET,
                    },
                    system: {
                        loggerOptions: {
                            loggerCallback(loglevel, message, containsPii) {
                                console.log(message);
                            },
                            piiLoggingEnabled: false,
                            logLevel: LogLevel.Verbose,
                        },
                    },
                };
            } else {
                const managedIdentityCredential = new ManagedIdentityCredential(process.env.MANAGED_IDENTITY_CLIENT_ID);
                const tokenResponse = await managedIdentityCredential.getToken(["api://AzureADTokenExchange"]);
                if (tokenResponse && tokenResponse.token) {
                    console.log("Authorization Step0: Token Issued by Managed Identity: " + tokenResponse.token);
                }

                msalConfig = {
                    auth: {
                        clientId: process.env.AZURE_CLIENT_ID,
                        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
                        clientAssertion: tokenResponse.token,
                    },
                    system: {
                        loggerOptions: {
                            loggerCallback(loglevel, message, containsPii) {
                                console.log(message);
                            },
                            piiLoggingEnabled: false,
                            logLevel: LogLevel.Verbose,
                        },
                    },
                };
            }
            this.client = new ConfidentialClientApplication(msalConfig);
        } 
        catch (error) {
            console.error('Error in instantiating the client app registration. :', error);
            throw error;
        }
    }

    // Proxy method to the ConfidentialClientApplication methods
    async acquireTokenByCode(request) {
        try {
            return await this.client.acquireTokenByCode(request); 
        } catch (error) {
            console.error('Error acquiring token:', error);
            throw error;
        }
    }

    async getRefreshTokenFromCache() {
        console.log("Retrieving the refresh token.....");
        const tokenCache = await this.client.getTokenCache().serialize();
        const refreshTokenObject = (JSON.parse(tokenCache)).RefreshToken
        const refreshToken = refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;

        return refreshToken;
    }

    // Proxy other methods as needed
    async getAuthCodeUrl(request) {
        try {
            return await this.client.getAuthCodeUrl(request);
        } catch (error) {
            console.error('Error acquiring authorization code:', error);
            throw error;
        }
    }

    // Proxy other methods as needed
    async acquireTokenByRefreshToken(request) {
        try {
            return await this.client.refreshToken(request);
        } catch (error) {
            console.error('Error acquiring refresh token:', error);
            throw error;
        }
    }

    async acquireTokenByClientCredential(request) {
        try {
            return await this.client.acquireTokenByClientCredential(request);
        } catch (error) {
            console.error('Error acquireTokenByClientCredential:', error);
            throw error;
        }
    }

    // Proxy other methods as needed
    async acquireTokenSilent(request) {
        try {
            return await this.client.acquireTokenSilent(request);
        } catch (error) {
            console.error('Error acquireTokenSilent:', error);
            throw error;
        }
    }

}

export default ClientApp;

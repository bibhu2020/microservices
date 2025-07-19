//This class is an interface to "Azure App Registration"
//It interacts with AAD to get you the access token. It uses @azure/msal-node library

//# Reference
//https://learn.microsoft.com/en-us/javascript/api/@azure/msal-node/confidentialclientapplication?view=msal-js-latest


import { ConfidentialClientApplication, LogLevel } from '@azure/msal-node';
import { ManagedIdentityCredential } from '@azure/identity';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

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
    static async getInstance() {
        if (!ClientApp.#instance) {
            ClientApp.#instance = new ClientApp();
            await ClientApp.#instance.init();

            // Set up a timer to destroy the instance every 30 minutes
            // this is because I want a fresh client assertion token from managed identity every 30 minutes
            // Otherwise the callback fails with "invalid_grant" error
            setTimeout(() => {
                ClientApp.#instance = null;
                console.log('ClientApp instance has been destroyed.');
            }, 30 * 60 * 1000); // 30 minutes in milliseconds
        }
        return ClientApp.#instance;
    }

    // Async initialization method
    async init() {
        let msalConfig;

        try {
            // In development environment, use CLIENT_SECRET
            if (process.env.AZURE_CLIENT_SECRET && process.env.AZURE_CLIENT_SECRET.length > 0) {
                msalConfig = {
                    auth: {
                        clientId: process.env.AZURE_CLIENT_ID,
                        authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
                        clientSecret: process.env.AZURE_CLIENT_SECRET,
                    },
                    system: {
                        loggerOptions: {
                            loggerCallback(loglevel, message, containsPii) {
                                // Only log errors, ignore all other levels
                                if (level === LogLevel.Error) {
                                    console.error(message);
                                }
                            },
                            piiLoggingEnabled: false,
                            logLevel: LogLevel.Error,
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

    // Get Authorization Code (used in Code Flow)
    async getAuthCodeUrl(tokenRequest) {
        try {
            return await this.client.getAuthCodeUrl(tokenRequest);
        } catch (error) {
            console.error('Error acquiring authorization code:', error);
            throw error;
        }
    }

    // Get Access Token using Azuthorization Code
    async acquireTokenByCode(tokenRequest) {
        try {
            return await this.client.acquireTokenByCode(tokenRequest); 
        } catch (error) {
            console.error('Error acquiring token:', error);
            throw error;
        }
    }

    // Get Refresh Token from Cache
    async getRefreshTokenFromCache() {
        console.log("Retrieving the refresh token.....");
        const tokenCache = await this.client.getTokenCache().serialize();
        const refreshTokenObject = (JSON.parse(tokenCache)).RefreshToken
        const refreshToken = refreshTokenObject[Object.keys(refreshTokenObject)[0]].secret;

        return refreshToken;
    }

    // Get Access Token using Refresh Token
    async acquireTokensUsingRefreshToken(refreshToken, scopes) {
        const tokenRequest = {
            refreshToken: refreshToken,
            scopes: scopes
        };
    
        try {
            const response = await this.client.acquireTokenByRefreshToken(tokenRequest);
            return response;
        } catch (error) {
            console.error('Error acquiring token using refresh token:', error);
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

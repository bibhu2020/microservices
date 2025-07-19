import { Injectable } from '@nestjs/common';
import { TokenCredential, AccessToken } from '@azure/core-auth';
import { AzureCliCredential, ManagedIdentityCredential } from '@azure/identity';

@Injectable()
export class AzureTokenService {

    private token: string | null = null;
    private tokenExpiry: number | null = null;  

    constructor() {
        this.token = null;
    }
    
    private setToken(token: string): void {
        this.token = token;
        this.setTokenExpiry(token); // Set the token expiry time
    }

    private decodeJWT(token) {
        //console.log("Decoding JWT token...", token);
        
        const base64Url = token.split('.')[1]; // The second part of the JWT (payload)
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/'); // Correct base64 encoding
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        return JSON.parse(jsonPayload); // Return the decoded payload as an object
    }

    private setTokenExpiry(token: string): void {
        const decoded = this.decodeJWT(token);
        this.tokenExpiry = decoded.exp; // Store the expiration time from
    }

    private isTokenExpired(): boolean {
        if (this.tokenExpiry === null) {
            console.error("Token expiry not set!");
            return true;
        }
        
        const currentTime = Math.floor(Date.now() / 1000); // Get the current time in seconds
        return this.tokenExpiry < currentTime; // Compare expiration time with current time
    }

    private async retrieveToken(): Promise<string | null> {
        const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID;
        const AZURE_MANAGED_IDENTITY = process.env.AZURE_MANAGED_IDENTITY;
        const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID;
        const SCOPE = 'https://management.azure.com/.default';
        let isLocalEnvironment = false;

        if (!AZURE_CLIENT_ID || !AZURE_MANAGED_IDENTITY || !AZURE_TENANT_ID) {
            console.error("Code is running in the local environment. Use the logged in user's CLI credential.");
            isLocalEnvironment = true;
        }

        if (isLocalEnvironment) {
            const credential = new AzureCliCredential();
            const token = credential.getToken(SCOPE).then((token) => {
                console.log("Token retrieved using DefaultAzureCredential:", token);
                return token.token;
            }).catch((error) => {
                console.error("Error retrieving token using DefaultAzureCredential:", error);
                return null;
            });

            return token; // Return the promise
           
        } else {
            const credential = new ManagedIdentityCredential({ clientId: AZURE_MANAGED_IDENTITY });
            const token = credential.getToken(SCOPE).then((token) => {
                console.log("Token retrieved using DefaultAzureCredential:", token);
                return token.token;
            }).catch((error) => {
                console.error("Error retrieving token using DefaultAzureCredential:", error);
                return null;
            });

            return token; // Return the promise
        }
    }
    
    async getToken(): Promise<string | null> {
        if (this.isTokenExpired()){
            const newToken = await this.retrieveToken();
            if (newToken !== null) {
                this.setToken(newToken);
            }
        }
        return this.token;
    }

    async getTokenCredential(): Promise<TokenCredential | null> {
        const credential: TokenCredential = {
            getToken: async (scopes, options) => {
                if (this.isTokenExpired()) {
                    const newToken = await this.retrieveToken();
                    if (newToken !== null) {
                        this.setToken(newToken);
                    }
                }
                return {
                    token: this.token,
                    expiresOnTimestamp: this.tokenExpiry ? this.tokenExpiry * 1000 : Date.now() + 60 * 60 * 1000,
                } as AccessToken;
            }
        };
        return credential;
    }
    
    clearToken(): void {
        this.token = null;
        this.tokenExpiry = null;
    }
}

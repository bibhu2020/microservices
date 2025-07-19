//This class is an interface to "Azure App Registration"
//It interacts with AAD to get you the access token. It does not use any identity library

import axios from 'axios';
import qs from 'qs';
import dotenv from 'dotenv';
//import { ClientAssertion } from '@azure/msal-node';
import { ManagedIdentityCredential } from '@azure/identity';


// Load environment variables from .env file

class ClientApp {
    // Private static instance
    static #instance;
    #tenantId="";
    #clientId="";
    #clientSecret="";
    //#managedIdentityclientId="";
    #tokenRequest={};
    #clientAssertion=null;


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
        }
        return ClientApp.#instance;
    }

    // Async initialization method
    async init() {
        dotenv.config();
        if (process.env.AZURE_CLIENT_SECRET && process.env.AZURE_CLIENT_SECRET.length > 0 ) {
            this.#tenantId = `${process.env.AZURE_TENANT_ID}`;
            this.#clientId = `${process.env.AZURE_CLIENT_ID}`;
            this.#clientSecret = `${process.env.AZURE_CLIENT_SECRET}`;
        } 
        else {
            this.#tenantId = `${process.env.AZURE_TENANT_ID}`;
            this.#clientId = `${process.env.AZURE_CLIENT_ID}`;
            const managedIdentityclientId = `${process.env.MANAGED_IDENTITY_CLIENT_ID}`;
            const managedIdentityCredential = new ManagedIdentityCredential(managedIdentityclientId);
            const tokenResponse = await managedIdentityCredential.getToken(["api://AzureADTokenExchange"]);
            this.#clientAssertion = tokenResponse.token;
        }
    }

    // Uses OAuth Client Credential Grant Flow to get Access Token
    async getAccessToken_ClientCredentialGrant(scopes = []){
        const tokenEndpoint = `https://login.microsoftonline.com/${this.#tenantId}/oauth2/v2.0/token`;

        //console.log('Scopes: ' + scopes.join(' '));

        if (process.env.AZURE_CLIENT_SECRET && process.env.AZURE_CLIENT_SECRET.length > 0 ) {
            this.#tokenRequest = {
                grant_type: 'client_credentials',
                client_id: this.#clientId,
                client_secret: this.#clientSecret,
                scope:  scopes.join(' ')
              };
        }
        else {
            this.#tokenRequest = {
                grant_type: 'client_credentials',
                client_id: this.#clientId,
                clientAssertion: this.#clientAssertion, 
                scope:  scopes.join(' ')
              };
        }

        try {
            const response = await axios.post(tokenEndpoint, qs.stringify(this.#tokenRequest), {
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            return response.data.access_token;
        } catch (error) {
            console.error('Error obtaining access token:', error.response ? error.response.data : error.message);
            throw error;
        }

    }

}

export default ClientApp;

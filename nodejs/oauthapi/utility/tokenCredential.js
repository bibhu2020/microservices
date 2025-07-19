// this is a singleton class that wraps msal client.

import { ConfidentialClientApplication, LogLevel } from '@azure/msal-node';
import { ManagedIdentityCredential } from '@azure/identity';
import jwt from 'jsonwebtoken';

// It must have getToken() function implemented that returns a credential object that wraps the accessToken.
// SecretClient("kvName", TokenCredential object) when called SecretClient calls getToken() retrieve the access token.   
class TokenCredential {
  static #instance;
  #accessToken;
  #expiresOn;
  #credentialType;
  #msalClient;
  #managedIdentityCredential;

  // Private constructor to prevent direct instantiation
  constructor() {
    if (TokenCredential.#instance) {
        throw new Error('Use TokenCredential.getInstance()');
    }
  }

  // Public static method to get the instance
  static async getInstance(credentialType,  bearerToken = null) {
    if (!TokenCredential.#instance) {
      TokenCredential.#instance = new TokenCredential();
      await TokenCredential.#instance.#init(credentialType,  bearerToken);
    }
    return TokenCredential.#instance;
  }

  static async destroyInstance(){
    TokenCredential.#instance = null;
  }

  #init = async (credentialType,  bearerToken = null) => {
    TokenCredential.#instance.#credentialType =  credentialType;

    //console.log("Credential Type: " + credentialType);

    if (credentialType === 'CS') { //client secret
      TokenCredential.#instance.#msalClient = new ConfidentialClientApplication({
        auth: {
          clientId: process.env.AZURE_CLIENT_ID,
          authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
          clientSecret: process.env.AZURE_CLIENT_SECRET,
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    // Only log errors, ignore all other levels
                    if (level === LogLevel.Error) {
                        console.error(message);
                    }
                },
                piiLoggingEnabled: false, // Disable logging of personally identifiable information
                logLevel: LogLevel.Error, // Set log level to Error to reduce verbosity
            },
        },
      });

    } else if (credentialType === 'FIC') { //Federated Identity Credential
      const managedIdentityCredential = new ManagedIdentityCredential(process.env.MANAGED_IDENTITY_CLIENT_ID);
      const tokenResponse = await managedIdentityCredential.getToken(["api://AzureADTokenExchange"]);
      if (tokenResponse && tokenResponse.token) {
          console.log("Authorization Step0: ID Token Issued by Managed Identity: " + tokenResponse.token);
      }

      TokenCredential.#instance.#msalClient = new ConfidentialClientApplication({
        auth: {
          clientId: process.env.AZURE_CLIENT_ID,
          authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
          clientAssertion: tokenResponse.token,
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    // Only log errors, ignore all other levels
                    if (level === LogLevel.Error) {
                        console.error(message);
                    }
                },
                piiLoggingEnabled: false, // Disable logging of personally identifiable information
                logLevel: LogLevel.Error, // Set log level to Error to reduce verbosity
            },
        },
      });

    } else if (credentialType === 'UT') { //user token as bearer token
      //this class instantiation is just to fool the static class. 
      //We do not need a class since the User Token is sent by caller as bearer token in the header.
      TokenCredential.#instance.#managedIdentityCredential = new ManagedIdentityCredential(process.env.AZURE_CLIENT_ID);
      TokenCredential.#instance.#accessToken = bearerToken;

    } else if (credentialType === 'MI') { //managed identity
      console.log("Managed Identity: " + process.env.MANAGED_IDENTITY_CLIENT_ID);
      TokenCredential.#instance.#managedIdentityCredential = new ManagedIdentityCredential(process.env.MANAGED_IDENTITY_CLIENT_ID);

    } else {
      throw new Error('Invalid credential type');
    }
  }

  getToken = async (scopes) => { //this method is called by Resource Client automatically. Hence, this must exists in this class.
    //return a Credential Object
    return {
      token: TokenCredential.#instance.#accessToken,
      expiresOnTimestamp: TokenCredential.#instance.#expiresOn,
    };
  }

  refreshAccessToken = async (tokenRequest = null, decoded = false) => {
    // Check if the token is still valid
    if (TokenCredential.#instance.#accessToken && TokenCredential.#instance.#expiresOn && Date.now() < TokenCredential.#instance.#expiresOn) {
      //do nothing
    } else {
      let tokenResponse;

      if (TokenCredential.#instance.#credentialType === 'CS' || 
          TokenCredential.#instance.#credentialType === "FIC") {
          tokenResponse = await TokenCredential.#instance.#msalClient.acquireTokenByClientCredential(tokenRequest);
  
          if (!tokenResponse) {
            throw new Error('Failed to acquire access token from Entra Client App.');
          }
          TokenCredential.#instance.#accessToken = tokenResponse.accessToken;
        TokenCredential.#instance.#expiresOn = Date.now() + tokenResponse.expiresIn * 1000;
      } else if (TokenCredential.#instance.#credentialType === 'MI') {
          tokenResponse = await TokenCredential.#instance.#managedIdentityCredential.getToken(tokenRequest.scopes);
  
          if (!tokenResponse) {
            throw new Error('Failed to acquire access token using managed identity');
          }
  
          TokenCredential.#instance.#accessToken = tokenResponse.token;
          TokenCredential.#instance.#expiresOn = tokenResponse.expiresOnTimestamp;
      } else if (TokenCredential.#instance.#credentialType === 'UT') {
          //token is aleready sent by the caller
          //TokenCredential.#instance.#accessToken = tokenResponse.token;
          TokenCredential.#instance.#expiresOn = Date.now() + 5 * 60 * 1000; // 5 minutes from now
      }
    }

    let accessToken = TokenCredential.#instance.#accessToken;
    if(decoded){
      accessToken = jwt.decode(accessToken, { complete: true });
    }
    return accessToken;
  }
}

export default TokenCredential;
import os
import msal
from azure.identity import AzureCliCredential, ManagedIdentityCredential
from datetime import datetime
import pytz

class TokenManager:
    def __init__(self, scope: str):
        """
        Initializes the TokenManager instance with the given OAuth scope.

        Parameters:
        - scope (str): The OAuth scope for the token request (e.g., "https://database.windows.net/.default").
        """
        self.__oauth_scope = scope  # The scope for the OAuth token (e.g., API access)
        self.__access_token = ""  # Stores the OAuth access token
        self.__token_expiration = 0  # Stores the expiration timestamp of the token
        
        # Retrieve environment variables for managed identity client and Azure app info
        self.__managed_identity_client_id = os.environ.get('MANAGED_IDENTITY_CLIENT_ID', '')  # Managed Identity Client ID
        self.__azure_tenant_id = os.environ.get('AZURE_TENANT_ID', '')  # Azure Tenant ID
        self.__azure_client_id = os.environ.get('AZURE_CLIENT_ID', '')  # Azure App Client ID

    def __get_token(self):
        """
        Fetches a new OAuth token if the current one is expired or empty. The method will attempt to use
        Azure CLI credentials if Managed Identity is not configured, or use Managed Identity if available.

        Token flow:
        1. Checks if the token is valid by comparing the current time with the expiration time.
        2. If valid, returns the existing token.
        3. If expired or absent, fetches a new token:
            - Use Azure CLI credentials if Managed Identity is not configured.
            - Use Managed Identity credentials with MSAL to exchange for a new token if Managed Identity is configured.

        Federated Identity Credential (FIC) Flow:
        - The Federated Identity Credential is used when working with **Managed Identity** in Azure to authenticate without needing to store credentials manually.
        - The flow is split into two parts:
            1. **Azure Managed Identity Token**: First, we acquire a token using Azure Managed Identity (via `ManagedIdentityCredential`).
            2. **Token Exchange with MSAL**: The token obtained from Managed Identity is then used as a client assertion in the MSAL flow to acquire a new access token for a specific scope.
        """
        # Check if the token has expired by comparing the expiration time with current time
        token_expiration_time = datetime.utcfromtimestamp(self.__token_expiration).replace(tzinfo=pytz.utc)
        current_time = datetime.utcnow().replace(tzinfo=pytz.utc)
        
        # If the token is still valid, return it
        if self.__access_token != "" and current_time < token_expiration_time:
            return self.__access_token

        # Token retrieval process if the token is expired or empty
        if self.__managed_identity_client_id == '':
            # Use Azure CLI credentials to acquire token if Managed Identity is not configured
            credential = AzureCliCredential()
            token_response = credential.get_token(self.__oauth_scope)
            self.__token_expiration = token_response.expires_on  # Save the expiration timestamp
            self.__access_token = token_response.token  # Save the acquired token
        else:
            # Use Managed Identity credentials to acquire token
            credential = ManagedIdentityCredential(client_id=self.__managed_identity_client_id)

            # Step 1: "api://AzureADTokenExchange" is a special scope used within Azure AD 
            #         that indicates the intent to use the token for a **token exchange operation**.
            token_response = credential.get_token("api://AzureADTokenExchange")

            if token_response and token_response.token:
                self.__token_expiration = token_response.expires_on  # Save the expiration timestamp

                # Step 2: Use MSAL to exchange the Managed Identity token for a new access token.
                confidential_credential = msal.ConfidentialClientApplication(
                    self.__azure_client_id,  # The Azure App's client ID
                    authority=f"https://login.microsoftonline.com/{self.__azure_tenant_id}",  # Tenant-specific authority URL
                    client_credential={"client_assertion": token_response.token},  # The assertion token obtained from Managed Identity
                )

                # Step 3: Request an access token for the target resource using MSAL
                result = confidential_credential.acquire_token_for_client(
                    scopes=[self.__oauth_scope]  # The scope for the desired resource access (e.g., database)
                )

                if "access_token" in result:
                    self.__access_token = result['access_token']  # Save the acquired access token
                else:
                    # If MSAL fails to acquire the token, print the error
                    print(f"Error: {result.get('error_description')}")
            else:
                # If the token exchange failed, print an error
                print("Failed to acquire token using Managed Identity.")

        return self.__access_token  # Return the valid (or newly acquired) access token

    def get_token(self):
        """
        Public method to retrieve a valid OAuth token by invoking __get_token.

        This method provides a way for other components to obtain a valid token for API calls.
        """
        return self.__get_token()  # Return the result of __get_token(), which may be a cached or freshly fetched token

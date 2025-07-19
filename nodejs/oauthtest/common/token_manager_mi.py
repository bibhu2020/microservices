import os
from azure.identity import AzureCliCredential, ManagedIdentityCredential
from datetime import datetime

class TokenManager:
    def __init__(self, scope: str):
        """
        Initializes the TokenManager instance with the given OAuth scope.

        Parameters:
        - scope (str): The OAuth scope for the token request (e.g., "https://database.windows.net/.default").
        """
        self.__scope = scope  # The scope for the OAuth token, which specifies the resource you're requesting access to
        self.__token = ""  # Stores the OAuth access token
        self.__token_expires = datetime.utcnow()  # Start with an expired token (so a new token will be requested on first use)
        
        # The Managed Identity Client ID, if provided, will be used for authenticating the managed identity.
        self.__managed_identity_client_id = os.environ.get('MANAGED_IDENTITY_CLIENT_ID', '') 

    def __get_token(self):
        """
        Fetches a new OAuth token if the current one is expired or empty.
        The method first checks if the token is still valid based on expiration time.
        If expired or empty, it requests a new token using Managed Identity or Azure CLI credentials.

        Managed Identity Flow:
        - **Managed Identity** is used if the application is running on an Azure resource (e.g., Azure VM, Azure App Service) 
          and has been assigned a **System-assigned** or **User-assigned Managed Identity**.
        - If the Managed Identity is configured, a token is requested using the `ManagedIdentityCredential` class.
        - If no Managed Identity is found (i.e., `MANAGED_IDENTITY_CLIENT_ID` is not set), it falls back to using **Azure CLI credentials**.
        
        Token Flow Steps:
        1. Check if the current token is valid (i.e., it has not expired).
        2. If the token is expired or absent, try to obtain a new token using Managed Identity.
        3. If Managed Identity is not available, fall back to Azure CLI credentials to acquire a token.
        """
        # Check if the token has expired by comparing the expiration time with the current time
        if self.__token and datetime.utcnow() < self.__token_expires:
            return self.__token  # Return the valid, non-expired token

        # If the token is invalid (either expired or empty), request a new token
        if self.__managed_identity_client_id:
            # If a Managed Identity Client ID is provided, use the Managed Identity Credential
            # This is the case when the application is running on an Azure resource with Managed Identity enabled
            self.credential = ManagedIdentityCredential(client_id=self.__managed_identity_client_id)
        else:
            # If no Managed Identity Client ID is provided, use Azure CLI credentials as a fallback
            # This is typically used when running the application locally, where the Azure CLI is configured
            self.credential = AzureCliCredential()

        # Request an OAuth token for the specified scope (API access)
        token_response = self.credential.get_token(self.__scope)
        
        # Store the token and its expiration time
        self.__token = token_response.token
        self.__token_expires = token_response.expires_on
        
        # Return the newly obtained token
        return self.__token

    def get_token(self):
        """
        Public method to retrieve a valid OAuth token by invoking __get_token.

        This method provides the mechanism for other components of the application to retrieve
        a valid token to authenticate API requests to Azure services.
        """
        return self.__get_token()  # Calls the internal method to get the token

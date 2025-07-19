# Overview
This is Proof of Concept that demonstrates OAuth Client Grant Flow. It's a Rest API build using nodejs, and it does the followings:

- Authorizes the caller (oauthapp) against AAD

- Reads Azure Resources (Key Vault) using 3 different identity
    - Managed Identity
    - FIC
    - Client Secret
    - Loging user credential

- Sends email using Azure Communication Service

- Posts and reads message from Azure Service Bus


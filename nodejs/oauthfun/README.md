# Overview
It reads email messages from Service Bus Q, and sends to Azure Communication Service for delivery.

## Pre-requsisites
- VS Code
- Azure Core Tool Extension
- Azure Function App Extension


## How to Start with an Azure Function App
```
func init MyFunctionApp --javascript
cd MyFunctionApp
func new --template "Timer trigger" --name TimerTriggerFunction
```

## Start Local Storage Emulator (if running locally)
```
npm install azurite
azurite
```

## Run function app locally
```
func start
```

## Deploy to Azure
```
zip -ru functionapp.zip . > /dev/null 2>&1

az functionapp deployment source config-zip \
    --resource-group oauthpocrg \
    --name oauthfun \
    --src functionapp.zip

az functionapp log tail --name oauthfun --resource-group oauthpocrg

```

```
func azure functionapp publish <YourFunctionAppName>
```

## Azure Function Using MAnaging Identity to Access Storage Account
```
"AzureWebJobsStorage" : "DefaultEndpointsProtocol=https;AccountName=oauthfun;EndpointSuffix=core.windows.net;Authentication=ManagedIdentity",

OR

"AzureWebJobsStorage" : "DefaultEndpointsProtocol=https;AccountName=oauthfun;EndpointSuffix=core.windows.net;Authentication=ManagedIdentity;ClientId=<user-assigned-managed-identity-client-id>",
```

# Why Azure Function App uses File Share by default?
- Deployment and Storage: Azure File Shares provide a simple way to store and manage function code and content, allowing multiple instances of a Function App to access the same files. This is particularly useful in a multi-instance scenario, ensuring that all instances have the same codebase.

- Scaling: When a Function App scales out to multiple instances, using a shared file system ensures that each instance has consistent access to the function files without needing to replicate code across instanc

- Development Convenience: For many developers, using Azure File Shares simplifies the development process, allowing easy updates and management of the function code without needing to redeploy or package everything each time.

## Options to Replace File Share

### Blob Storage


### Zip Deployment
ZIP deployment allows you to package your Azure Function App code, dependencies, and configuration into a single ZIP file and upload it to Azure. This method can be used for both initial deployments and subsequent updates.

### Containerized Deployment


### Continuous Deployment from Source Control



### App Service Storage (does not work on consumption plan)
The App Service Storage approach allows you to utilize built-in storage capabilities provided by Azure App Service to manage files and data without needing external file shares. 

This is preferred over zip deployment when you want to store state files within the app service plan apart from just deployment code.


### Use Azure DevOps Pipelines


# Function App Quick Start (using Javascript and Function App Runtime v4)

## Pre-requisites
- Install Azure Function App Core Tools
- Install and Run azurite (before debugging locally). The Azurite open-source emulator provides a free local environment for testing your Azure Blob, Queue Storage, and Table Storage applications.
```
$npm install -g azurite
$azurite
```
Note: Azurite or storage is required to maintain state for timer trigger, but not for http trigger. timer trigger maintains the last run time in the storage.

Note:
When running on Azure, you can maintain the state in dB, storage account, in-memory. Must popular way is storage account. You must install storage blob component, and storage the storage connection string in "AzureWebJobsStorage" in host.json.
```
$npm install @azure/storage-blob

{
    "name": "AzureWebJobsStorage",
    "value": "DefaultEndpointsProtocol=https;AccountName=oauthfun;EndpointSuffix=core.windows.net;Authentication=ManagedIdentity;ClientId=8e4cd7a8-09ff-41a4-aa8b-e8843105756d",
    "slotSetting": true
  }
```


## Create using Core Tool
//Create a local function project
func init --javascript

//Add a HTTP trigger function
func new --name HttpExample --template "HTTP trigger" --authlevel "anonymous" 

//Add Azure Storage connection information in local.settings.json.
{
    "Values": {       
        "AzureWebJobsStorage": "<Azure Storage connection information>",
        "FUNCTIONS_WORKER_RUNTIME": "node"
    }
 }

// Alternate: It prompts you an UI to choose template
func new


// (Optional) If you want to learn more about a particular function, say HTTP trigger,
 func help httptrigger

// Run the function locally
func start



## Create Function App Resources in Azure and Deploy

//Create resource group
az group create --name AzureFunctionsQuickstart-rg --location <REGION>

//Create a general-purpose storage account in your resource group and region
az storage account create --name <STORAGE_NAME> --location <REGION> --resource-group AzureFunctionsQuickstart-rg --sku Standard_LRS -allow-blob-public-access false

//Create a function app
 az functionapp create --resource-group AzureFunctionsQuickstart-rg --consumption-plan-location <REGION> --runtime node --runtime version 18 --functions-version 4 --name <APP_NAME> --storage account <STORAGE_NAME>

// Deploy a function app
func azure functionapp publish <APP_NAME>

func azure functionapp publish oauthfun


## Create a Function to Service Bus Queue
func extensions install


# Local Storage Emulator
"AzureWebJobsStorage": "UseDevelopmentStorage=true",
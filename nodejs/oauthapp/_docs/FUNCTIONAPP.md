# Azure Function Apps Tips
Azure Function App requires a storage account (blob) to maintain it's running state, and to make sure no duplicate process triggers on the same data. Whenever you create a function app, it automatically creates a storage account, and links to the function app using access key. You can't get rid of this storage, especially if your trigger is Timer, or a Service Bus. For Http Trigger, you may delete it.
 
Now the question is, how to make it work when you have the access key disabled on the storage account access key. Here are the steps:
- Rename the environment variable "AzureWebJobsStorage" to "AzureWebJobsStorage__accountName"

- Store the storage account name in it. Just the name. Example - oauthfunc

- Configure the function app to run under a managed identity

- Give the manage identity "Blob Data Owner" role on the storage account

- Restart the function app

At this point, it should work. If you are using "User Managed Identity", it may have to add AZURE_CLIENT_ID to the environment variable, and store the user managed identity client  id in it.
 
With this setup, the code will also run locally as long as your log in account has access to the storage account. 
 
Similarly, if your function app needs to access Service Bus using managed identity, you will have to add an environment variable called AzureWebJobsServiceBus__fullyQualifiedNamespace. 

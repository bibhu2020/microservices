from azure.identity import AzureCliCredential
from azure.mgmt.storage import StorageManagementClient
from azure.mgmt.resource import SubscriptionClient
from azure.core.exceptions import AzureError

def list_storage_accounts(subscriptions):
    # Authenticate using Azure CLI credentials
    credential = AzureCliCredential()

    # Initialize the subscription client
    subscription_client = SubscriptionClient(credential)

    storage_accounts = {}

    # Iterate over the given subscriptions
    for subscription_id in subscriptions:
        try:
            # Initialize the storage management client for the current subscription
            storage_client = StorageManagementClient(credential, subscription_id)
            
            # List storage accounts in the current subscription
            accounts = storage_client.storage_accounts.list()
            
            storage_accounts[subscription_id] = []
            for account in accounts:
                storage_accounts[subscription_id].append(account.name)

        except AzureError as e:
            print(f"Failed to process subscription {subscription_id}: {e}")
            continue
    
    return storage_accounts

if __name__ == "__main__":
    # Array of subscription IDs
    subscriptions = ["b0d2509d-9ee4-4fc8-b4b7-4391a8ac1aaf",
                     "0a5cfe5c-0982-401a-85f7-0d132c1cb536", 
                     "433cb7d3-bac1-4059-bacf-afb085b7a62b", 
                     "56b2c80b-1904-40ce-b905-81213c43ca34", 
                     "<subscription_id_3>"]

    storage_accounts = list_storage_accounts(subscriptions)

    for subscription_id, accounts in storage_accounts.items():
        print(f"Subscription ID: {subscription_id}")
        for account in accounts:
            print(f"  - Storage Account: {account}")

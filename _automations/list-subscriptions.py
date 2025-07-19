# List the subscriptions I've access to
## pip install azure-identity azure-mgmt-resource

from azure.identity import AzureCliCredential
from azure.mgmt.resource import SubscriptionClient

# Initialize the Azure CLI credential
credential = AzureCliCredential()

# Initialize the Subscription client
subscription_client = SubscriptionClient(credential)

# List subscriptions
subscriptions = subscription_client.subscriptions.list()

print("Subscriptions you have access to:")
for subscription in subscriptions:
    print(f"Subscription ID: {subscription.subscription_id}, Display Name: {subscription.display_name}")

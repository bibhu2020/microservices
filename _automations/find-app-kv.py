import argparse
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient
from azure.mgmt.web import WebSiteManagementClient

# Function to check if an App Service or Function refers to a Key Vault
def refers_to_key_vault(settings):
    for key, value in settings.items():
        if isinstance(value, str) and 'vault.azure.net' in value:
            return True
    return False

def main(subscription_id):
    # Initialize credentials and clients
    credential = DefaultAzureCredential()
    resource_client = ResourceManagementClient(credential, subscription_id)
    web_client = WebSiteManagementClient(credential, subscription_id)

    # List all resource groups in the subscription
    resource_groups = resource_client.resource_groups.list()

    for rg in resource_groups:
        print(f'Checking resource group: {rg.name}')
        
        # List all App Services in the resource group
        app_services = web_client.web_apps.list_by_resource_group(rg.name)
        for app in app_services:
            app_settings = web_client.web_apps.list_application_settings(rg.name, app.name)
            if refers_to_key_vault(app_settings.properties):
                print(f'App Service "{app.name}" refers to a Key Vault')

        # List all Function Apps in the resource group
        function_apps = web_client.web_apps.list_by_resource_group(rg.name, filter="kind eq 'functionapp'")
        for function_app in function_apps:
            function_app_settings = web_client.web_apps.list_application_settings(rg.name, function_app.name)
            if refers_to_key_vault(function_app_settings.properties):
                print(f'Function App "{function_app.name}" refers to a Key Vault')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Check App Services and Function Apps for Key Vault references in an Azure subscription.')
    parser.add_argument('subscription_id', type=str, help='Azure Subscription ID')
    
    args = parser.parse_args()
    main(args.subscription_id)

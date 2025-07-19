# Find the "application registration"
#######Dependencies
# pip3 install azure-identity requests


from azure.identity import AzureCliCredential
import requests

# Initialize the Azure CLI credential
credential = AzureCliCredential()

# Acquire a token
token = credential.get_token("https://graph.microsoft.com/.default")
access_token = token.token
headers = {'Authorization': f'Bearer {access_token}'}

# List of application (client) IDs
app_ids = [
    'isvsignup-test-aad',
    'isvsignup-dev-aad'
]

for app_id in app_ids:
    # Microsoft Graph API endpoint to list application owners
    graph_url = f'https://graph.microsoft.com/v1.0/applications/{app_id}/owners'

    response = requests.get(graph_url, headers=headers)

    if response.status_code == 200:
        owners = response.json().get('value', [])
        print(f"Owners of application {app_id}:")
        for owner in owners:
            print(f"Name: {owner.get('displayName', 'N/A')}, User Principal Name: {owner.get('userPrincipalName', 'N/A')}")
        print()  # Newline for better readability
    else:
        print(f"Failed to retrieve owners for application {app_id}: {response.status_code} {response.text}")

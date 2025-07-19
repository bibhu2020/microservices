from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.fileshare import ShareServiceClient

# Function to list files in Azure file share
def list_files_in_azure_file_share(account_name, account_key, share_name):
    connection_string = f"DefaultEndpointsProtocol=https;AccountName={account_name};AccountKey={account_key};EndpointSuffix=core.windows.net"
    share_service_client = ShareServiceClient.from_connection_string(connection_string)
    file_share_client = share_service_client.get_share_client(share_name)
    file_client = file_share_client.get_directory_client()  # Root directory

    file_list = file_client.list_directories_and_files()

    files = []
    for file_or_dir in file_list:
        if file_or_dir.is_directory:
            files.append(f"[Directory] {file_or_dir.name}")
        else:
            files.append(f"[File] {file_or_dir.name}")

    return files

if __name__ == "__main__":
    # Azure Key Vault details
    key_vault_url = "https://aksoc-stg-eastus-kv1.vault.azure.net/"
    secret_name = "aksocstgeastuslogs-key"

    # Azure file share details
    account_name = 'aksocstgeastuslogs'
    share_name = 'secblog'
    directory_name = '.'
    file_name = 'access.log.*'

    # Get the storage key from Azure Key Vault
    credential = DefaultAzureCredential()
    secret_client = SecretClient(vault_url=key_vault_url, credential=credential)
    account_key = secret_client.get_secret(secret_name).value

    # List files in Azure file share
    files = list_files_in_azure_file_share(account_name, account_key, share_name)

    # Print the list of files
    print("Files in Azure file share:")
    for file in files:
        print(file)

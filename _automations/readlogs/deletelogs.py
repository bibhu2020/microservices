from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.fileshare import ShareServiceClient
from datetime import datetime, timedelta, timezone

# Function to delete files older than specified days in Azure file share
def delete_old_files_in_azure_file_share(account_name, account_key, share_name, days_to_keep):
    connection_string = f"DefaultEndpointsProtocol=https;AccountName={account_name};AccountKey={account_key};EndpointSuffix=core.windows.net"
    share_service_client = ShareServiceClient.from_connection_string(connection_string)
    file_share_client = share_service_client.get_share_client(share_name)
    file_client = file_share_client.get_directory_client()  # Root directory

    # Get the current date and time in UTC timezone
    current_time_utc = datetime.now(timezone.utc)

    # Calculate the date 7 days ago in UTC timezone
    older_than_date_utc = current_time_utc - timedelta(days=days_to_keep)

    # List files in the root directory
    file_list = file_client.list_directories_and_files()

    # Delete files older than the specified days
    for file_or_dir in file_list:
        if not file_or_dir.is_directory:
            file_properties = file_client.get_file_client(file_or_dir.name).get_file_properties()
            last_modified_utc = file_properties.last_modified.replace(tzinfo=timezone.utc)
            # Check if the file is older than the specified days
            if last_modified_utc < older_than_date_utc:
                print("deleting: " + file_or_dir.name)
                file_client.get_file_client(file_or_dir.name).delete_file()

if __name__ == "__main__":
    # Azure Key Vault details
    key_vault_url = "https://aksoc-stg-eastus-kv1.vault.azure.net/"
    secret_name = "aksocstgeastuslogs-key"

    # Azure file share details
    account_name = 'aksocstgeastuslogs'
    share_name = 'secblog'

    # Get the storage key from Azure Key Vault
    credential = DefaultAzureCredential()
    secret_client = SecretClient(vault_url=key_vault_url, credential=credential)
    account_key = secret_client.get_secret(secret_name).value

     # Number of days to keep files
    days_to_keep = 7

    # Delete files older than specified days in Azure file share
    delete_old_files_in_azure_file_share(account_name, account_key, share_name, days_to_keep)


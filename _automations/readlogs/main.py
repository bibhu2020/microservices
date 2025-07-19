from azure.identity import DefaultAzureCredential
from azure.keyvault.secrets import SecretClient
from azure.storage.fileshare import ShareServiceClient
from collections import Counter

# Function to read log data from Azure file share
def read_log_from_azure_file_share(account_name, account_key, share_name, directory_name, file_name):
    connection_string = f"DefaultEndpointsProtocol=https;AccountName={account_name};AccountKey={account_key};EndpointSuffix=core.windows.net"
    share_service_client = ShareServiceClient.from_connection_string(connection_string)
    # file_share_client = share_service_client.get_share_client(share_name)
    # directory_client = file_share_client.get_directory_client(directory_name)
    # file_client = directory_client.get_file_client(file_name)
    file_share_client = share_service_client.get_share_client(share_name)
    file_client = file_share_client.get_file_client(file_name)
    
    log_data = file_client.download_file().readall().decode('utf-8')
    return log_data.split('\n')

# Function to analyze log data
def analyze_log_data(log_data):
    log_levels = [line.split()[1] for line in log_data if line.strip()]  # Assuming log format: timestamp log_level message
    log_level_counts = Counter(log_levels)
    return log_level_counts

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
    storage_key = secret_client.get_secret(secret_name).value

    # Read log data from Azure file share
    log_data = read_log_from_azure_file_share(account_name, storage_key, share_name, directory_name, file_name)

    # Analyze log data
    log_level_counts = analyze_log_data(log_data)

    # Print log level counts
    print("Log Level Counts:")
    for log_level, count in log_level_counts.items():
        print(f"{log_level}: {count}")

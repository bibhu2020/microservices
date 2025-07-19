import csv
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient

# Set up Azure credentials and resource management client
credential = DefaultAzureCredential()
subscription_id = '0a5cfe5c-0982-401a-85f7-0d132c1cb536'
resource_client = ResourceManagementClient(credential, subscription_id)

# Function to loop through resource groups and find tags
def list_resource_group_tags():
    # List all resource groups
    resource_groups = resource_client.resource_groups.list()

    # Open a CSV file to write the resource group names and tags
    with open('./tags/list-rg-tags.csv', mode='w', newline='') as file:
        writer = csv.writer(file)
        
        # Write the header row
        writer.writerow(['Resource Group', 'Tag Key', 'Tag Value'])

        for rg in resource_groups:
            rg_name = rg.name
            rg_tags = rg.tags
            if rg_tags:
                for tag_key, tag_value in rg_tags.items():
                    writer.writerow([rg_name, tag_key, tag_value])
            else:
                writer.writerow([rg_name, 'No tags', 'No tags'])

# Function to read resource groups and tag them
def tag_resource_groups(tag_key, tag_value):
    # List all resource groups
    resource_groups = resource_client.resource_groups.list()
    
    for rg in resource_groups:
        rg_name = rg.name
        rg_location = rg.location
        
        # Get the current tags
        current_tags = rg.tags if rg.tags else {}

        # Update the tags
        current_tags[tag_key] = tag_value

        # Apply the new tags to the resource group
        resource_client.resource_groups.create_or_update(
            rg_name,
            {
                'location': rg_location,
                'tags': current_tags
            }
        )
        print(f'Tagged resource group {rg_name} with {tag_key}: {tag_value}')

# Define the tag key and value
#tag_key = 'Environment'
#tag_value = 'Production'

# Call the function to tag resource groups
# tag_resource_groups(tag_key, tag_value)

list_resource_group_tags()


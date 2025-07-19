import json
from azure.identity import DefaultAzureCredential
from azure.mgmt.resource import ResourceManagementClient


# Function to get the latest API version for a resource
def get_latest_api_version(resource_client, resource):
    provider, resource_type = resource.type.split('/', 1)
    provider_details = resource_client.providers.get(provider)
    resource_type_details = next(
        (t for t in provider_details.resource_types if t.resource_type == resource_type),
        None
    )
    if resource_type_details:
        return sorted(resource_type_details.api_versions, reverse=True)[0]
    else:
        raise ValueError(f"Resource type {resource.type} not found in provider {provider}")


# Function to tag resource groups based on JSON input
def tag_resource_groups_from_json(json_file):
    with open(json_file, 'r') as file:
        data = json.load(file)

    subscription_id = data['subscription_id']
    resource_groups = data['resource_groups']

    # Set up Azure credentials and resource management client
    credential = DefaultAzureCredential()
    resource_client = ResourceManagementClient(credential, subscription_id)

    for item in resource_groups:
        rg_name = item['resource_group']
        tags = item['tags']

        try:
            # Get the current resource group details
            rg = resource_client.resource_groups.get(rg_name)
            current_tags = rg.tags if rg.tags else {}

            # Update the tags based on the input JSON
            for tag in tags:
                tag_key = tag['key']
                tag_value = tag['value']
                overwrite_flag = tag['overwrite']

                if tag_key in current_tags:
                    if overwrite_flag == 'Y':
                        current_tags[tag_key] = tag_value
                        print(f'Overwriting tag {tag_key} for resource group {rg_name}')
                    else:
                        print(f'Skipping tag {tag_key} for resource group {rg_name} (exists and overwrite is N)')
                else:
                    current_tags[tag_key] = tag_value
                    print(f'Adding tag {tag_key} for resource group {rg_name}')

            # Apply the updated tags to the resource group
            resource_client.resource_groups.create_or_update(
                rg_name,
                {
                    'location': rg.location,
                    'tags': current_tags
                }
            )
            print(f'Tagged resource group {rg_name} successfully')

            #List all resources in the resource group
            resources = resource_client.resources.list_by_resource_group(rg_name)
            for resource in resources:
                resource_id = resource.id
                resource_tags = resource.tags if resource.tags else {}

                # Update the tags for each resource
                for tag in tags:
                    tag_key = tag['key']
                    tag_value = tag['value']
                    overwrite_flag = tag['overwrite']

                    if tag_key in resource_tags:
                        if overwrite_flag == 'Y':
                            resource_tags[tag_key] = tag_value
                            print(f'Overwriting tag {tag_key} for resource {resource_id}')
                        else:
                            print(f'Skipping tag {tag_key} for resource {resource_id} (exists and overwrite is N)')
                    else:
                        resource_tags[tag_key] = tag_value
                        print(f'Adding tag {tag_key} for resource {resource_id}')

                # Extract resource details
                # Get the latest API version for the resource
                api_version = get_latest_api_version(resource_client, resource)
                
                # Apply the updated tags to the resource
                print(f'Tags: {resource_tags}')
                resource_client.resources.update_by_id(
                    resource_id,
                    api_version=api_version,
                    parameters={
                        'tags': resource_tags
                    }
                )
                print(f'Tagged resource {resource_id} successfully')

        except Exception as e:
            print(f'Error processing resource group {rg_name}: {str(e)}')

# Define the path to your JSON file
json_file_path = './tags/tags.json'

# Call the function to tag resource groups from JSON
tag_resource_groups_from_json(json_file_path)

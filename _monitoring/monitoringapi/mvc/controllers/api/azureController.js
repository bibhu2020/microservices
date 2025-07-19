import { ResourceManagementClient } from '@azure/arm-resources';
import { DefaultAzureCredential } from '@azure/identity';

class AzureController {
  async listResourceGroups(req, res) {
    // Define your Azure subscription ID
    const subscriptionId = '433cb7d3-bac1-4059-bacf-afb085b7a62b';

    // Create an instance of the ResourceManagementClient
    const credential = new DefaultAzureCredential();
    const resourceClient = new ResourceManagementClient(credential, subscriptionId);
    let data = "";

    try {
      const resourceGroupList = [];

      // List all resource groups
      const groups = await resourceClient.resourceGroups.list();

      // Iterate over each resource group
      for await (const group of groups) {
        // Retrieve additional details for each resource group
        const groupDetails = await resourceClient.resourceGroups.get(group.name);
        const location = groupDetails.location;
        const tags = groupDetails.tags;
                
        // Push group name, creation date, and owner to resourceGroupList array
        resourceGroupList.push({
          name: group.name,
          location: location,
          tags: tags
        });
      }

      // Return the resource group list as JSON
      data = JSON.stringify(resourceGroupList, null, 2);
    } catch (error) {
      console.error('An error occurred:', error);
      data = null;
    }

    res.status(200);
    // Set Content-Type header to application/json
    res.setHeader('Content-Type', 'application/json');
    // Send JSON response
    res.send(data);
  }
}

export default AzureController;

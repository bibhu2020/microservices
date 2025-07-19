from azure.identity import DefaultAzureCredential
from azure.mgmt.web import WebSiteManagementClient
from azure.monitor.query import MetricsQueryClient
from datetime import datetime, timedelta

# Azure Setup - replace with your details
subscription_id = 'b0d2509d-9ee4-4fc8-b4b7-4391a8ac1aaf'
resource_group = 'cloud-blogs-ms-pre-prod-rg'
app_service_name = 'cloudblogs-ms-pre-prod'

# Time range for the query - last 30 days
start_time = datetime.now() - timedelta(days=30)
end_time = datetime.now()

# Authenticate
credential = DefaultAzureCredential()
web_client = WebSiteManagementClient(credential, subscription_id)
metrics_client = MetricsQueryClient(credential)

# Attempt to retrieve detailed App Service configuration
app_service_details = web_client.web_apps.get(resource_group, app_service_name)

# The specific attribute or method to access might vary. Adjust as necessary.
# Displaying the entire object for debugging purposes.
# Look for attributes related to hostnames or custom domains in the output.
# print(app_service_details)

# if hasattr(app_service_details, 'host_names'):
#     print("Custom Domains:")
#     for hostname in app_service_details.host_names:
#         print(hostname)

# # # Get the App Service's custom domains
# custom_domains = web_client.web_apps.host_names(resource_group, app_service_name)
# print(custom_domains)

# Construct the resource ID for the App Service
resource_id = f"/subscriptions/{subscription_id}/resourceGroups/{resource_group}/providers/Microsoft.Web/sites/{app_service_name}"

# Check metrics for each custom domain
for domain in app_service_details.host_names:
    hostname = domain
    print(f"Checking domain: {hostname}")

    # Query Azure Monitor for the Requests metric, filtered by hostname
    response = metrics_client.query_resource(
        resource_id,
        metric_names=['Http5xx', 'Http4xx', 'Http2xx'],  # You might adjust these metrics based on what you consider "active"
        timespan=(start_time, end_time),
        aggregations=['Total'],
        filter=f"HostName eq '{hostname}'"
    )

#     # Summarize and display the results
#     total_requests = sum(metric.sum.value for metric in response.metrics if metric.sum is not None)
#     print(f"Total requests for {hostname} in the last 30 days: {total_requests}")

#     if total_requests > 0:
#         print(f"{hostname} is active.")
#     else:
#         print(f"{hostname} appears to be inactive.")

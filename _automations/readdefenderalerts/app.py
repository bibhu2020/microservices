from azure.identity import DefaultAzureCredential
from azure.mgmt.security import SecurityCenter
from azure.mgmt.subscription import SubscriptionClient
import pandas as pd

# Authenticate using the DefaultAzureCredential
credential = DefaultAzureCredential()

# Initialize the Subscription client to list subscriptions
subscription_client = SubscriptionClient(credential)

# List all subscriptions
subscriptions = subscription_client.subscriptions.list()

# Prepare a list to hold all alerts data
all_alerts_data = []

# Loop through subscriptions
for subscription in subscriptions:
    subscription_id = subscription.subscription_id
    subscription_name = subscription.display_name
    print(f"Processing subscription: {subscription_name} ({subscription_id})")
    
    # Initialize SecurityCenter client for the current subscription
    security_center = SecurityCenter(credential, subscription_id)
    
    # Get Defender alerts for the current subscription
    alerts = security_center.alerts.list()
    
    # Iterate through alerts and collect necessary information
    for alert in alerts:
        alert_data = {
            "Subscription ID": subscription_id,
            "Subscription Name": subscription_name,
            "Alert Name": alert.alert_display_name,
            "Severity": alert.severity,
            "Alert ID": alert.id,  # Using `id` as the unique identifier, though it might not be directly usable for URLs
            # Additional fields can be added here based on the available alert properties
        }
        all_alerts_data.append(alert_data)

# Convert alerts data into a DataFrame
df_alerts = pd.DataFrame(all_alerts_data)

# Save the DataFrame to an Excel file
excel_filename = "Azure_Defender_Alerts.xlsx"
df_alerts.to_excel(excel_filename, index=False)

print(f"Alerts have been saved to {excel_filename}")

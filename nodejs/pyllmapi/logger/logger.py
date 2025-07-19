# telemetry.py
import os
from applicationinsights import TelemetryClient

# Fetch the connection string from environment variable or fallback to default
connection_string = os.getenv("APPINSIGHTS_CONNECTION_STRING", "InstrumentationKey=f3dac908-4ce0-4837-8a22-5cdf9c551393;IngestionEndpoint=https://westus2-0.in.applicationinsights.azure.com/")

# Create an instance of TelemetryClient using the connection string
tc = TelemetryClient(connection_string)

# Optional: Add any configuration if needed (e.g., setting up context or tags)
tc.context.device.role_name = "pyllmapi"
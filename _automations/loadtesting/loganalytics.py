from azure.identity import DefaultAzureCredential
from azure.monitor.query import LogsQueryClient
import pandas as pd
from datetime import timedelta

def read_log_analytics(workspace_id, query, output_file, timespan):
    # Create a Log Analytics query client
    credential = DefaultAzureCredential()
    client = LogsQueryClient(credential)

    # Execute the query
    result = client.query_workspace(workspace_id, query, timespan=timespan)

    # Convert the response to a DataFrame
    tables = result.tables
    if tables:
        df = pd.DataFrame()
        for table in tables:
            for row in table.rows:
                df = df.append(pd.Series(row, index=table.columns), ignore_index=True)

        # Save the DataFrame to an Excel file
        df.to_excel(output_file, index=False, engine='openpyxl')
    else:
        print("No data returned from the query.")

if __name__ == "__main__":
    # Define the Azure Log Analytics workspace ID and query
    workspace_id = '5938c293-3317-4e63-9b33-a248eb20cc81'
    query = '''
    AzureDiagnostics 
    | where endpoint_s contains "translator" and endpoint_s !contains "xtranslator" 
    and toint(httpStatusDetails_s) >= 400
    '''
    output_file = 'logs.xlsx'
    timespan = timedelta(days=1)  # Query data from the last day

    read_log_analytics(workspace_id, query, output_file, timespan)

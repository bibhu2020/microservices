import os
from flask_restful import Resource
from flask import request, jsonify
from datetime import datetime, timedelta

from azure.identity import DefaultAzureCredential
from azure.monitor.query import LogsQueryClient
import pandas as pd
from langchain_openai import ChatOpenAI, AzureChatOpenAI
from langchain_core.prompts import PromptTemplate

# Authenticate using Azure's default credentials
credential = DefaultAzureCredential()
client = LogsQueryClient(credential)

# Define your Application Insights workspace ID
workspace_id = 'edf08e1f-916f-48c3-bc52-273492d63c8f'

# Queries
queries = {
    "failed_requests": """
        AppRequests
        | where AppRoleName contains "msonecloudapi" and Success != true
        | project TimeStamp = TimeGenerated, OperationName=Name, OperationHttpCode=ResultCode, OperationId, OriginServer=AppRoleName
        | order by TimeStamp desc  
    """,
    "exceptions": """
        AppExceptions
        | where AppRoleName contains "msonecloudapi"
        | project TimeStamp = TimeGenerated, Type, Message=OuterMessage, OperationId, OriginServer=AppRoleName
        | order by TimeStamp desc 
    """,
    "dependencies": """
        AppDependencies 
        | where AppRoleName contains "msonecloudapi" and Success != true 
        | project TimeStamp=TimeGenerated, DependencyService=Target, Operation=Name, DependencyServiceURI=Data, DependencyType, DependencyServiceHttpCode=ResultCode, OriginServer=AppRoleName, OperationId, ClientCity
        | order by TimeStamp desc 
    """,
    "diagnostics": """
        AzureDiagnostics 
        | where Category != "FrontDoorHealthProbeLog" and toint(httpStatusCode_s) >= 400
        | project TimeStamp = TimeGenerated, HttpMethod=httpMethod_s, ServiceHttpCode = httpStatusCode_s, ResourceId, URI=requestUri_s, OriginServer=originName_s
        | order by TimeStamp desc  
    """
}

def query_application_insights(query):
    end_time = datetime.utcnow()
    start_time = end_time - timedelta(minutes=15)
    timespan = (start_time, end_time)

    response = client.query_workspace(
        workspace_id,
        query,
        timespan=timespan
    )
    return response

def logs_query_result_to_df(logs_query_result):
    if logs_query_result.tables:
        table = logs_query_result.tables[0]
        columns = table.columns
        rows = table.rows
        return pd.DataFrame(rows, columns=columns)
    return pd.DataFrame()

# Initialize OpenAI with your API key
llm = ChatOpenAI(model="gpt-4o", temperature=0.2)

# llm = AzureChatOpenAI(
#     azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
#     azure_deployment=os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME"),
#     openai_api_version=os.environ.get("AZURE_OPENAI_API_VERSION"), temperature=0.2
# )

# Define the prompt template
prompt_template = PromptTemplate(
    input_variables=["diagnostics_context", "dependencies_context"],
# template="""Analyze the following application logs to identify and diagnose any issues. Focus on finding the top 3 most issues that requires immediate attention. Your response should be brief and organized into three sections in JSON format:

#             1. **What's Impacted**: Clearly specify which part of the system (service, endpoint, or operation) is affected. Highlight any relevant error messages or failed operations.

#             2. **What's the Root Cause**: Dig into the logs to determine the underlying cause of the issue. Look for patterns, anomalies, or correlations that point to the specific root cause without introducing multiple issues.

#             3. **What's the Recommended Fix**: Provide actionable recommendations to resolve the identified issue.

#             Please ensure clarity and avoid introducing multiple issues to prevent confusion.

#             Application diagnostics from Azure Front Door indicating potential issues in `httpsStatusCode_s`:
#             {diagnostics_context}

#             Origin of the issue based on failed requests, exceptions, and dependencies. Link to diagnostics data using timestamps and origin name: 
#             {other_context}
#             """

    template="""Analyze the following application logs to identify and diagnose issues. Your goal is to find the top 3 most critical issues which has occurred more than 5 times and that require immediate attention. 

            For each issue, include the following three sections:

            1. **Service Impacted**:
            - Clearly specify which part of the system is affected (e.g., service, endpoint, or operation).
            - Highlight any relevant error messages, failed operations, or anomalies.

            2. **Root Cause**:
            - Identify the underlying cause of the issue based on the logs.
            - Look for specific patterns or correlations that point directly to the root cause.
            - If you cannot determine the root cause, state: "I can't determine the root cause."

            3. **Recommended Fix**:
            - Provide clear, actionable recommendations to resolve the identified issue.

            4. **Count**:
            - Specify the count of the issue.

            ### Additional Instructions:
            - Ensure your analysis is precise and focused to avoid confusion.
            - Follow a top-to-bottom troubleshooting approach, considering dependency failures if available to conclude the root cause.
            - Specify the top affected endpoint or service in each issue.
            - Please structure your response in JSON format, numbering each issue as `issue1`, `issue2`, etc.
            - When you report issue with a service, please provide the complete name of the service.

            ### Contextual Data:
            - Traffic diagnostics from Azure Front Door indicating potential issues in `Http Status Code`:
            {diagnostics_context}

            - Analyze the origin of the issue based on failed requests and dependencies (link to diagnostics data using timestamps, request URI, and origin server):
            {dependencies_context}
            """
)

import json
import re

def generate_insights(diagnostics_data, dependencies_data):
    diagnostics_context = diagnostics_data.to_string()
    dependencies_context = dependencies_data.to_string()
    prompt = prompt_template.format(diagnostics_context=diagnostics_context, dependencies_context=dependencies_context)
    response = llm.invoke(prompt)
    insights = response.content

    # Remove code block formatting if present
    insights = re.sub(r'^```json|```$', '', insights.strip(), flags=re.MULTILINE)
    
    
    # Parse the response content as JSON
    try:
        insights_json = json.loads(insights)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse insights as JSON: {e}")
    
    return insights_json

class AppInsightAPIV1(Resource):
    def get(self):
        try:
            # Query Application Insights
            print('Querying Application Insights...')
            diagnostics = logs_query_result_to_df(query_application_insights(queries["diagnostics"]))
            failed_requests = logs_query_result_to_df(query_application_insights(queries["failed_requests"]))
            exceptions = logs_query_result_to_df(query_application_insights(queries["exceptions"]))
            dependencies = logs_query_result_to_df(query_application_insights(queries["dependencies"]))

            # Debugging: Print raw query results
            print("Diagnostics DataFrame:", diagnostics.head())
            print("Failed Requests DataFrame:", failed_requests.head())
            print("Exceptions DataFrame:", exceptions.head())
            print("Dependencies DataFrame:", dependencies.head())

            # Limit the number of rows and select relevant columns
            diagnostics = diagnostics.head(50)[["TimeStamp", "HttpMethod", "ServiceHttpCode", "ResourceId", "URI", "OriginServer"]]
            failed_requests = failed_requests.head(50)[["TimeStamp", "OperationName", "OperationHttpCode", "OperationId", "OriginServer"]]
            exceptions = exceptions.head(50)[["TimeStamp", "Type", "Message", "OperationId", "OriginServer"]]
            dependencies = dependencies.head(50)[["TimeStamp", "DependencyService", "DependencyServiceHttpCode", "OperationId", "OriginServer"]]

            # Analyze the other data
            print('Analyzing other data...')
            #exception_data = pd.concat([failed_requests, exceptions], axis=1, join='inner')

            dependencies_data = pd.concat([failed_requests, exceptions, dependencies], axis=1, join='outer')

            # Debugging: Print analyzed data
            print("Exception Data:", dependencies_data)

            if diagnostics.empty and  dependencies_data.empty:
                return {"result": "No anomaly observed in last 1 hour."}, 404

            # Generate insights for both diagnostics and other data
            print('Generating insights...')
            insights = generate_insights(diagnostics, dependencies_data)
            print("Insights and Recommendations:")
            
            print(insights)
            
            # Return the result as JSON with the chat history
            return {"results": insights}, 200

        except Exception as e:
            return {"error": str(e)}, 500
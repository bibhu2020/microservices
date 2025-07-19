from flask_restful import Resource
from datetime import datetime, timedelta
from pydantic import BaseModel, Field

# Azure and LangChain imports
from azure.identity import DefaultAzureCredential
from azure.monitor.query import LogsQueryClient
from langchain_openai import ChatOpenAI
from langchain.agents import initialize_agent, Tool, AgentExecutor
from langchain.prompts import PromptTemplate

import pandas as pd

# Azure and OpenAI credentials
credential = DefaultAzureCredential()
client = LogsQueryClient(credential)
workspace_id = 'cc686f01-2472-42da-af2f-a81712f2e606'  # Application Insights Workspace ID

# Table information
table_info = {
    "AppRequests": {"columns": ["OperationId", "Url", "DurationMs", "Success", "TimeGenerated", "AppRoleName"]},
    "AppExceptions": {"columns": ["OperationId", "Message", "ItemCount", "TimeGenerated"]},
    "AppDependencies": {"columns": ["OperationId", "Name", "Target", "Data", "TimeGenerated"]},
}

# Azure Logs Query Tool using LangChain
class LogsQueryTool(Tool, BaseModel):
    client: LogsQueryClient = Field(default_factory=lambda: LogsQueryClient(DefaultAzureCredential()))

    def __init__(self):
        super().__init__(name="Azure LogsQueryTool", description="Query Azure Logs.", func=self._run)

    def _run(self, query: str):
        end_time = datetime.utcnow()
        start_time = end_time - timedelta(minutes=15)  # Adjust the time span as needed
        timespan = (start_time, end_time)

        print("Querying Azure Logs with the following query:", query)

        response = self.client.query_workspace(
            'cc686f01-2472-42da-af2f-a81712f2e606',
            query,
            timespan=timespan
        )
        if response.tables:
            return response.tables[0].rows
        return []

# Helper function to convert query results into a Pandas DataFrame
def logs_query_result_to_df(logs_query_result, table_name):
    if hasattr(logs_query_result, 'tables') and logs_query_result.tables:
        table = logs_query_result.tables[0]
        columns = table_info[table_name]["columns"]
        rows = table.rows
        return pd.DataFrame(rows, columns=columns)
    return pd.DataFrame()

# Analyze the data by merging failed requests, exceptions, and dependencies
def analyze_data(failed_requests, exceptions, dependencies):
    failed_df = logs_query_result_to_df(failed_requests, "AppRequests")
    exceptions_df = logs_query_result_to_df(exceptions, "AppExceptions")
    dependencies_df = logs_query_result_to_df(dependencies, "AppDependencies")

    merged_data = pd.merge(failed_df, exceptions_df, on='OperationId', how='left')
    merged_data = pd.merge(merged_data, dependencies_df, on='OperationId', how='left')

    return merged_data

# Initialize LangChain OpenAI agent
llm = ChatOpenAI(temperature=0.5)

# Define the dynamic query prompt template with examples
query_prompt_template = PromptTemplate(
    input_variables=["issue_type"],
    template="""
    Based on the following issue type: {issue_type}, generate a valid KQL query to retrieve relevant data from the Azure Application Insights tables. 

    Ensure that the query:
    - Returns tabular results.
    - Does not contain any unsupported syntax.
    - Starts with a table name and includes necessary filters and projections.

    While you can refer to the following examples as guidance, feel free to include any relevant tables or columns that might be appropriate for the issue type:

    Examples of valid KQL query samples. You can use these as references for generating the final query:
    1. AppRequests | project OperationId, Url, DurationMs, Success
    2. AppExceptions | project OperationId, Message, ItemCount
    3. AppDependencies | project OperationId, Name, Target, Data

    Here are some notes:
    1. Success is a boolean field.
    2. do not use any column name that is not listed in table info.

    Your response should provide a KQL query that best addresses the issue type described.
    """
)

# Tool for generating dynamic KQL queries using OpenAI
class KQLQueryGeneratorTool(Tool):
    def __init__(self):
        super().__init__(name="KQLQueryGenerator", description="Generate KQL query based on issue type.", func=self._run)

    def _run(self, issue_type):
        prompt = query_prompt_template.format(issue_type=issue_type)
        llm = ChatOpenAI(temperature=0.5)
        response = llm.invoke(prompt)
        query = response.content.strip()  # Access the content attribute and strip any extra spaces or newlines

        #print("Generated KQL query:", query)

        # Validate the generated query using table_info
        valid_tables = table_info.keys()
        if not any(query.lower().startswith(table.lower()) for table in valid_tables):
            raise ValueError("Generated query does not start with a valid table name")
        if not "| " in query:
            raise ValueError("Generated query does not contain necessary filters and projections")
        # if not query.lower().startswith("print"):
        #     query += " | project *"

        return query

# Initialize the KQL query generator tool
kql_query_tool = KQLQueryGeneratorTool()

# Initialize LangChain agent with tools
tools = [
    kql_query_tool,
    LogsQueryTool()
]
agent = initialize_agent(tools=tools, llm=llm, handle_parsing_errors=True)

# Function to chunk data
def chunk_data(dataframe, chunk_size):
    for i in range(0, len(dataframe), chunk_size):
        yield dataframe.iloc[i:i + chunk_size]

# Flask API Resource for querying and providing insights
class AppInsightAPIV2(Resource):
    def get(self):
        try:
            # Step 1: Ask the agent to generate KQL queries dynamically
            issue_type = "failed requests and exceptions"  # You can replace this with dynamic user input
            print("Generating KQL queries for:", issue_type)
            failed_requests_query = agent.run(f"Generate a KQL query for {issue_type} in AppRequests.")
            exceptions_query = agent.run(f"Generate a KQL query for exceptions in AppExceptions.")
            dependencies_query = agent.run(f"Generate a KQL query for failed dependencies in AppDependencies.")
            
            # Step 2: Query Application Insights using generated queries
            print("Querying Application Insights...")
            failed_requests = agent.run(f"Query Azure Logs with this query: {failed_requests_query}")
            exceptions = agent.run(f"Query Azure Logs with this query: {exceptions_query}")
            dependencies = agent.run(f"Query Azure Logs with this query: {dependencies_query}")
            
            # Step 3: Analyze and merge the data
            print("Analyzing data...")
            analyzed_data = analyze_data(failed_requests, exceptions, dependencies)

            if analyzed_data.empty:
                return {"result": "No anomaly observed in the last hour."}, 404
            
            # Select the latest top 5 rows from the merged data
            latest_data = analyzed_data.sort_values(by='TimeGenerated', ascending=False).head(5)

            # Select only relevant columns
            relevant_columns = ["OperationId", "Url", "Message", "Target", "TimeGenerated"]
            latest_data = latest_data[relevant_columns]

            # Step 4: Generate insights based on the latest top 5 rows
            print("Generating insights...")
            insights_prompt_template = PromptTemplate(
                input_variables=["context"],
                template="Based on the following application data, provide insights and recommendations:\n\n{context}"
            )

            # Chunk the data and analyze each chunk separately
            chunk_size = 1  # Adjust the chunk size as needed
            insights_list = []
            for chunk in chunk_data(latest_data, chunk_size):
                context = chunk.to_string()
                prompt = insights_prompt_template.format(context=context)
                insights = agent.run(prompt)
                insights_list.append(insights)

            # Aggregate insights from all chunks
            aggregated_insights = "\n".join(insights_list)

            return {"result": aggregated_insights}, 200

        except Exception as e:
            print("An error occurred:", str(e))
            return {"error": str(e)}, 500
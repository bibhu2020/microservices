import os
import logging
from flask_restful import Resource
from flask import request, jsonify
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import (
    BaseChatMessageHistory,
    InMemoryChatMessageHistory,
    HumanMessage,
    AIMessage,
)
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.output_parsers import StrOutputParser

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize LLM outside of the request handler
azure_endpoint = os.environ.get("AZURE_OPENAI_ENDPOINT")
azure_deployment = os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME")
openai_api_version = os.environ.get("AZURE_OPENAI_API_VERSION")

if not azure_endpoint or not azure_deployment or not openai_api_version:
    logger.error("Azure OpenAI environment variables are not set properly.")
    raise EnvironmentError("Azure OpenAI environment variables are not set properly.")

llm = AzureChatOpenAI(
    azure_endpoint=azure_endpoint,
    azure_deployment=azure_deployment,
    openai_api_version=openai_api_version,
)

# Set up a chat history to store messages for the chatbot
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = InMemoryChatMessageHistory()
    return store[session_id]

# System and user message templates
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

# Initialize the parser once
parser = StrOutputParser()

# Create a chain that includes the prompt and the LLM
chain = prompt | llm | parser

# Create a runnable (executable) with message history
with_message_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="messages",
)


class AzureChatbotAPI(Resource):
    def post(self):
        try:
            # Get the JSON data from the request
            data = request.get_json()
            if not data:
                logger.error("No JSON data found in the request.")
                return {"error": "No JSON data found in the request."}, 400

            session_id = data.get('session_id')
            text = data.get('text')

            if not session_id or not text:
                logger.error("Missing 'session_id' or 'text' in the request.")
                return {"error": "Missing 'session_id' or 'text' in the request."}, 400

            config = {"configurable": {"session_id": session_id}}

            result = with_message_history.invoke(
                {"messages": [HumanMessage(content=text)], "language": "English"},
                config=config
            )

            retValue = {
                "status": "success",
                "data": result
            } 

            # Return the result as JSON with the chat history
            return retValue, 200

        except Exception as e:
            logger.exception("An error occurred while processing the request.")
            return {"error": str(e)}, 500
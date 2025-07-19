import os
from flask_restful import Resource
from flask import request, jsonify
from langchain_openai import AzureChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from functools import lru_cache

# Optimize: Move LLM initialization outside of the request handler
llm = AzureChatOpenAI(
    azure_endpoint=os.environ.get("AZURE_OPENAI_ENDPOINT"),
    azure_deployment=os.environ.get("AZURE_OPENAI_DEPLOYMENT_NAME"),
    openai_api_version=os.environ.get("AZURE_OPENAI_API_VERSION"),
)

# System and user message templates - Optimize prompt for simplicity
system_template = "Translate to {language}:"
user_template = "{text}"

# Create prompt template combining system and user messages
prompt_template = ChatPromptTemplate.from_messages(
    [("system", system_template), ("user", user_template)]
)

# Initialize the parser once
parser = StrOutputParser()

# Cache results for repeated requests to improve performance
@lru_cache(maxsize=100)
def get_translation_from_cache(language, text):
    chain = prompt_template | llm | parser
    result = chain.invoke({"language": language, "text": text})
    
    if hasattr(result, 'choices') and result.choices:
        return result.choices[0]['message']['content']
    return str(result)

class AzureTranslationAPI(Resource):
    def post(self):
        try:
            # Get the JSON data from the request
            data = request.get_json()
            language = data.get('language')
            text = data.get('text')

            # Ensure that both language and text are provided
            if not language or not text:
                return {"error": "Both 'language' and 'text' are required"}, 400

            # Cache lookup or invoke the chain to get the result
            result_str = get_translation_from_cache(language, text)

            retValue = {
                "status": "success",
                "data": result_str
            } 

            # Return the result as JSON with the chat history
            return retValue, 200

        except Exception as e:
            return {"error": str(e)}, 500

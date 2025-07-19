import os
from flask_restful import Resource
from flask import request, jsonify
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from functools import lru_cache
from logger import tc  # Import the TelemetryClient instance

# Initialize LLM outside of the request handler
openai_api_key = os.environ.get("OPENAI_API_KEY")
model_name = os.environ.get("OPENAI_API_MODEL", "gpt-3.5-turbo")

if not openai_api_key:
    tc.track_trace("OpenAI API key is not set properly.", severity='error')
    raise EnvironmentError("OpenAI API key is not set properly.")

llm = ChatOpenAI(api_key=openai_api_key, model=model_name)

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

class TranslationAPI(Resource):
    def post(self):
        try:
            # Get the JSON data from the request
            data = request.get_json()
            if not data:
                tc.track_trace("No JSON data found in the request.", severity='warning')
                return {"error": "No JSON data found in the request."}, 400

            language = data.get('language')
            text = data.get('text')

            if not language or not text:
                tc.track_trace("Missing 'language' or 'text' in the request.", severity='warning')
                return {"error": "Both 'language' and 'text' are required"}, 400

            # Cache lookup or invoke the chain to get the result
            result_str = get_translation_from_cache(language, text)

            retValue = {
                "status": "success",
                "data": result_str
            }

            # Track successful translation
            tc.track_trace(f"Translation successful for language: {language}", severity='info')

            # Return the result as JSON with the chat history
            return retValue, 200

        except Exception as e:
            # Track exception
            tc.track_exception()
            tc.track_trace(f"An error occurred: {str(e)}", severity='error')
            return {"error": str(e)}, 500
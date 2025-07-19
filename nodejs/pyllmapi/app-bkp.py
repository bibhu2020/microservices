import os
import logging
from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS  # Import CORS
# from controllers.translation_controller_azure_openai import AzureTranslationAPI
from controllers.translation_controller import TranslationAPI

# from controllers.chatbot_controller_azure_openai import AzureChatbotAPI
from controllers.chatbot_controller import ChatbotAPI

# from controllers.appinsight_controllerv1 import AppInsightAPIV1
# from controllers.appinsight_controllerv2 import AppInsightAPIV2

# from controllers.test_controllerv1 import TestAPIV1
# from controllers.code_controller import CodeAPI

from opencensus.ext.azure.log_exporter import AzureLogHandler
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.ext.azure.metrics_exporter import new_metrics_exporter
from opencensus.ext.flask.flask_middleware import FlaskMiddleware
from opencensus.trace.samplers import ProbabilitySampler
from opencensus.trace.tracer import Tracer

# Set up Application Insights connection string
connection_string = os.getenv("APPINSIGHTS_CONNECTION_STRING", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")

# Initialize Flask app
app = Flask(__name__)

# Integrate Flask middleware to capture telemetry
middleware = FlaskMiddleware(
    app,
    exporter=AzureExporter(connection_string=connection_string),
    sampler=ProbabilitySampler(rate=1.0)  # 100% of requests are traced, you can reduce the sample rate
)

# Set up metrics exporter for collecting standard metrics like request count, duration, etc.
metrics_exporter = new_metrics_exporter(connection_string=connection_string)

# Set up the logger to capture logs into Application Insights
logger = logging.getLogger(__name__)
logger.addHandler(AzureLogHandler(connection_string=connection_string))
logger.setLevel(logging.INFO)

# Redirect print statements to logging
logging.basicConfig(level=logging.INFO)
logging.getLogger().addHandler(AzureLogHandler(connection_string=connection_string))



# Enable CORS for specific origins
# CORS(app, resources={r"/*": {"origins": ["http://localhost:8080", "https://oauth.azurewebsites.net"]}})
CORS(app)  # Enable CORS for all origins

# Initialize Flask-Restful API
api = Api(app)

# Define a home route to indicate the service is up
@app.route('/')
def home():
    return jsonify({"message": "Hello, the translation service is up and running!"})

# Define the translation endpoint
# api.add_resource(AzureTranslationAPI, '/azuretranslate')
api.add_resource(TranslationAPI, '/translate')

# Define the chatbot endpoint
api.add_resource(ChatbotAPI, '/chatbot')
# api.add_resource(AzureChatbotAPI, '/azurechatbot')

# Define the appinsight endpoint
# api.add_resource(AppInsightAPIV2, '/appinsightv2')
# api.add_resource(AppInsightAPIV1, '/appinsightv1')

# api.add_resource(TestAPIV1, '/testapiv1')
# api.add_resource(CodeAPI, '/codeapi')

# Define the RAG Endpoint

# Run the Flask app
if __name__ == '__main__':
    port = int(os.getenv('PORT', 8082))
    app.run(debug=True, port=port)
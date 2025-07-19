import os
import logging
from flask import Flask, jsonify
from flask_restful import Api
from flask_cors import CORS

from controllers.translation_controller import TranslationAPI
from controllers.chatbot_controller import ChatbotAPI

from opencensus.ext.azure.log_exporter import AzureLogHandler
from opencensus.ext.azure.trace_exporter import AzureExporter
from opencensus.ext.azure.metrics_exporter import new_metrics_exporter
from opencensus.ext.flask.flask_middleware import FlaskMiddleware
from opencensus.trace.samplers import ProbabilitySampler

# Set up Application Insights connection string
connection_string = os.getenv("APPINSIGHTS_CONNECTION_STRING", "your_default_connection_string")

# Initialize Flask app
app = Flask(__name__)

# Enable CORS for all origins (consider restricting this to specific origins)
CORS(app)

# Initialize Flask-Restful API
api = Api(app)

# Define a home route to indicate the service is up
@app.route('/')
def home():
    return jsonify({"message": "Hello, the translation service is up and running!"})

# Define the translation endpoint
api.add_resource(TranslationAPI, '/translate')

# Define the chatbot endpoint
api.add_resource(ChatbotAPI, '/chatbot')

# Define a method to configure logging
def configure_logging(app_name):
    logger = logging.getLogger(__name__)
    logger.addHandler(AzureLogHandler(connection_string=connection_string))
    logger.setLevel(logging.INFO)

    # Redirect print statements to logging
    logging.basicConfig(level=logging.INFO)
    logging.getLogger().addHandler(AzureLogHandler(connection_string=connection_string))

# Define a method to configure telemetry
def configure_telemetry(app_name):
    # Integrate Flask middleware to capture telemetry
    FlaskMiddleware(
        app,
        exporter=AzureExporter(connection_string=connection_string),
        sampler=ProbabilitySampler(rate=1.0)
    )

    # Set up metrics exporter
    new_metrics_exporter(connection_string=connection_string)

if __name__ == '__main__':
    app_name = "pyllmapi"  # Set your application name here
    configure_logging(app_name)
    configure_telemetry(app_name)
    port = int(os.getenv('PORT', 8082))
    app.run(debug=True, port=port)
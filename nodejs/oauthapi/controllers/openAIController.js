import AzureOpenAI from 'openai';
import catchAsync from '../utility/catchAsync.js';

class OpenAIController {
    constructor() {
        this.apiKey = process.env.AZURE_OPENAI_API_KEY;
        this.endpoint = process.env.AZURE_OPENAI_ENDPOINT;
        this.model = process.env.AZURE_OPENAI_MODEL;
        this.apiVersion = "2024-02-01";
        this.deployment = process.env.AZURE_OPENAI_MODEL; //"gpt-35-turbo-instruct"; //The deployment name for your completions API model. The instruct model is the only new model that supports the legacy API.


        // Initialize the OpenAI API client with Azure configuration
        this.openai = new AzureOpenAI({
            endpoint: this.endpoint,
            apiKey: this.apiKey,
            apiVersion: this.apiVersion,
            deployment: this.deployment
         });

        // The prompt to train the model to return a specific JSON format for weather reports
        this.basePrompt = `
            You are a weather reporting assistant. Generate a weather report in the following JSON format.

            Format:
            {
                "location": "City Name",
                "date": "YYYY-MM-DD",
                "weather": {
                    "temperature": "XX°C",
                    "humidity": "XX%",
                    "wind_speed": "XX km/h",
                    "description": "Weather description"
                }
            }

            Example 1:
            User: What is the weather like in New York on 2024-09-15?

            {
                "location": "New York",
                "date": "2024-09-15",
                "weather": {
                    "temperature": "22°C",
                    "humidity": "70%",
                    "wind_speed": "15 km/h",
                    "description": "Partly cloudy"
                }
            }

            Example 2:
            User: Show the weather report for Tokyo on 2024-09-10.

            {
                "location": "Tokyo",
                "date": "2024-09-10",
                "weather": {
                    "temperature": "27°C",
                    "humidity": "80%",
                    "wind_speed": "12 km/h",
                    "description": "Sunny"
                }
            }

            Now, please generate the weather report in JSON format for the following request:
            User: `;
    }

    // Async function for generating the weather report using Azure OpenAI
    weatherReport = catchAsync(async (req, res, next) => {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'No query provided' });
        }

        try {
            // Make a request to OpenAI using the OpenAI library
            const response = await this.openai.completions.create({
                model: this.deployment,
                prompt: `${this.basePrompt} ${query}`,
                max_tokens: 200,
                temperature: 0.5
            });

            const weatherReport = response.choices[0].text.trim();
            res.status(200).json({
                status: 'success',
                data: weatherReport
            });
        } catch (error) {
            console.error('Error querying Azure OpenAI:', error);
            next(error); // Pass the error to the error-handling middleware
        }
    });
}

// Export the class as an ES module
export default OpenAIController;

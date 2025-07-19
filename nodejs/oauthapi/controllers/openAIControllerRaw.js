import axios from 'axios';
import jsonlint  from 'jsonlint';
import catchAsync from '../utility/catchAsync.js';

class OpenAIController {
    constructor() {
        this.apiKey = process.env.AZURE_OPENAI_API_KEY;
        this.endpoint = process.env.AZURE_OPENAI_ENDPOINT; // Should look like https://<your-resource-name>.openai.azure.com
        this.deployment = process.env.AZURE_OPENAI_MODEL; // The deployment ID for your Azure OpenAI model
        this.apiVersion = "2024-02-01"; // The API version for Azure OpenAI

        // The prompt to train the model to return a specific JSON format for weather reports
        this.basePrompt = `
            You are a weather reporting assistant. Generate a weather report in the following JSON format.
            If the location is not provided, use the default location. 
            If the user enters absurd query other than weather, respond to him his location weather.
            Also, while generating the weather report, if the date is not provided, use the current date.

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

            Now, please generate the weather report in JSON format for the following request. Make sure its a valid JSON only. Do NOT return any embedded code or comments along with the JSON response.:
            User: `;
    }

    // Async function for generating the weather report using Azure OpenAI
    weatherReport = catchAsync(async (req, res, next) => {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'No query provided' });
        }

        try {
            // Make a POST request to Azure OpenAI using Axios
            const response = await axios.post(
                `${this.endpoint}/openai/deployments/${this.deployment}/completions?api-version=${this.apiVersion}`,
                {
                    prompt: `${this.basePrompt} ${query}`,
                    max_tokens: 200,
                    temperature: 0.5
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'api-key': this.apiKey,  // Correct Azure OpenAI header
                    }
                }
            );

            let weatherReport = response.data.choices[0].text.trim();
            //remove escape characters
            weatherReport = weatherReport.replace(/\\n/g, "").replace(/\\"/g, '"');
            weatherReport = JSON.parse(weatherReport);


            //res.json({ report: weatherReport });

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

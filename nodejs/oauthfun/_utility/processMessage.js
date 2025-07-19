// messageProcessor.js
import axios from 'axios';

// Define the API endpoint and Bearer token
const apiBaseUrl = process.env.EMAIL_API_URL;
const apiKey = process.env.EMAIL_API_KEY;

export async function processMessage(log, errorLog, message) {
    log(`Received message: ${JSON.stringify(message)}`); // Log the entire message object

    const { emailFrom, emailTo, emailSubject, emailBody, htmlMessage } = message;
    log(`Debug: Received message: ${emailFrom} - ${emailTo} - ${emailSubject} - ${emailBody}`);

    // Prepare the payload for the API call
    const payload = {
        emailFrom,
        emailTo,
        emailSubject,
        emailBody
    };

    // Make the API call using Axios
    try {
        let apiEndpoint = '';
        if (htmlMessage === true) {
            apiEndpoint = `${apiBaseUrl}/key/api/emailHtml`;
        } else {
            apiEndpoint = `${apiBaseUrl}/key/api/email`;
        }

        const response = await axios.post(apiEndpoint, payload, {
            headers: {
                'Authorization': `ApiKey ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        log(`Debug: API response: ${response.status} - ${response.statusText}`);

    } catch (apiError) {
        errorLog(`Debug: Error making API call: ${apiError.message}`, apiError);
    }
}
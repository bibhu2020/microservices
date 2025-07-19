// Controller that reads Azure Resoruces
import axios from 'axios';
import jwt from 'jsonwebtoken';
import catchAsync from '../utility/catchAsync.js';
import ClientApp from "../utility/clientAppClientCredential.js";

// *********************************It uses client credential flow to get Api access token
// *************************************************************************************************************
class AzureController {
    #accessToken = null;
    #clientApp = null;
    #scopes = [];

    constructor() {
        //this.#scopes = [`api://${process.env.AZURE_API_CLIENT_ID}/access_as_user`];
        this.#scopes = [`api://${process.env.AZURE_API_CLIENT_ID}/.default`]
    }

    #getAccessToken = async () => {
        try {
            //if(!this.#accessToken){
                this.#clientApp = await ClientApp.getInstance();
                this.#accessToken = await this.#clientApp.getAccessToken_ClientCredentialGrant(this.#scopes);
            //}
        } catch (error) {
            console.error('Error getting API access token:', error);
        } finally {
            //console.log("API access token:" + jwt.decode(this.#accessToken));
            return this.#accessToken;
        }
    };

    listKvSecrets = catchAsync(async (req, res, next) => {
        try {

            const kvName = process.env.KEY_VAULT_NAME || req.query.name;
            const accessMethod = req.query.accessMethod || "CS";

            // Make API call
            const response = await axios.get(`${process.env.API_URI}/unauthorized/api/azure/listkvsecrets?name=${kvName}&accessMethod=${accessMethod}`);
            //const data = response.data;
            
            // Pass data to template
            res.render('azure/kv', response.data);
        } catch (error) {
            console.error('Error fetching kv data:', error);
            next(error);
        }
    });

    listKvSecrets_protected = catchAsync(async (req, res, next) => {
        try {
            const kvName = process.env.KEY_VAULT_NAME || req.query.name;
            const accessMethod = req.query.accessMethod || "CS";

            const accessToken = await this.#getAccessToken();

            //console.log('access token 999: ' + accessToken );

            // Make API call
            const response = await axios.get(`${process.env.API_URI}/api/azure/listkvsecrets?name=${kvName}&accessMethod=${accessMethod}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            //const data = response.data;
            
            // Pass data to template
            res.render('azure/kv', response.data);
        } catch (error) {
            next(error);
        }
    });

    weather = async (req, res, next) => {
        try {
            // Make API call
            const response = await axios.get(`${process.env.API_URI}/unauthorized/api/weather`);

            //console.log(JSON.stringify(response));

            //const data = response.data;
           
            // Pass data to template
            res.render('azure/weather', response.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }

    weatheropenai = async (req, res, next) => {
        try {
            // Make API call               
            // Pass data to template
            res.render('azure/weatheropenai');
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }

    weather_protected = catchAsync(async (req, res, next) => {
        try {
            const accessToken = await this.#getAccessToken();


            // Make API call
            const response = await axios.get(`${process.env.API_URI}/api/weather?city=Bhubaneswar`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                  }
            });
            //const data = response.data;
            
            // Pass data to template
            res.render('azure/weather', response.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    });

    users = async (req, res, next) => {
        try {
            // Make API call
            const response = await axios.get(`${process.env.API_URI}/unauthorized/api/graph/users`);
           
            // Pass data to template
            res.render('azure/users', response.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    }

    users_protected = catchAsync(async (req, res, next) => {
        try {
            const accessToken = await this.#getAccessToken();

            // Make API call
            const response = await axios.get(`${process.env.API_URI}/api/graph/users`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                  }
            });
            
            // Pass data to template
            res.render('azure/users', response.data);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            throw error;
        }
    });

    getemail = catchAsync(async (req, res, next) => {
        //console.log('load email page');
        res.render('azure/email');
    });
    
    postemail = catchAsync(async (req, res, next) => {
        //console.log('post email to api');
        //sends a json response
        const { emailTo, emailFrom, emailSubject, emailBody } = req.body;
        //console.log('subhect: ' + emailSubject);
        const payload = {
          emailTo: emailTo,
          emailFrom: emailFrom,
          emailSubject: emailSubject,
          emailBody: emailBody
        };
    
        try {
          // Send the data to the external API
          const apiResponse = await fetch(`${process.env.API_URI}/key/api/queueEmail`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `ApiKey ${process.env.API_KEY}` // If your API requires an API key or token
              },
              body: JSON.stringify(payload)
          });
    
          //console.log(payload);
    
          const apiResult = await apiResponse.json();
    
          if (apiResponse.ok) {
              // Forward the API's response back to the UI
              res.setHeader('Content-Type', 'application/json');
              res.json({ message: 'Email queued successfully!', apiResult });
          } else {
              // Handle the error from the API
              res.setHeader('Content-Type', 'application/json');
              res.status(apiResponse.status).json({ error: `API Error: ${apiResult}` });
          }
        } catch (error) {
            console.error('Error forwarding data to the API:', error);
            res.setHeader('Content-Type', 'application/json');
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
}

export default AzureController;

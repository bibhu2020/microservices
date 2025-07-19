// Controller that reads Azure Resources
import axios from 'axios';
import { fileURLToPath } from 'url';
import path from 'path';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import catchAsync from '../utility/catchAsync.js';
import ClientApp from "../utility/clientAppClientCredential.js";

// *********************************It uses client credential flow to get Api access token
// *************************************************************************************************************
class AuditController {
    #accessToken = null;
    #clientApp = null;
    #scopes = [];

    constructor() {
        //this.#scopes = [`api://${process.env.AZURE_API_CLIENT_ID}/access_as_user`];
        this.#scopes = [`api://${process.env.AZURE_API_CLIENT_ID}/.default`]

        // Get the current file path and directory name
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        this.__dirname = __dirname;
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

    list = catchAsync(async (req, res, next) => {
        try {
            // Make API call
            const response = await axios.get(`${process.env.API_URI}/unauthorized/api/audit/list?all=true`);
            const data = response.data.data;

            // Assuming you have a file named 'subscriptions.json' in the same directory
            const jsonPath = path.join(this.__dirname, 'subscriptions.json');

            // Read subscriptions.json file
            const subscriptions = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

            //console.log({ data: data, subscriptions: subscriptions })

            // Pass data and subscriptions to template
            res.render('audit/list', { data: data, subscriptions: subscriptions });
        } catch (error) {
            console.error('Error fetching audit data:', error);
            next(error);
        }
    });

    list_protected = catchAsync(async (req, res, next) => {
        try {
            const accessToken = await this.#getAccessToken();

            // Make API call
            const response = await axios.get(`${process.env.API_URI}/api/audit/list?all=true`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = response.data.data;

            // Assuming you have a file named 'subscriptions.json' in the same directory
            const jsonPath = path.join(this.__dirname, 'subscriptions.json');

            // Read subscriptions.json file
            const subscriptions = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

            //console.log({ data: data, subscriptions: subscriptions })

            // Pass data and subscriptions to template
            res.render('audit/list', { data: data, subscriptions: subscriptions });
        } catch (error) {
            next(error);
        }
    });

}

export default AuditController;
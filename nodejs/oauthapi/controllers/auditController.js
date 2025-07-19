// Audit Controller - It reads the audit report from sreadmin cosmos db.

import { CosmosClient } from '@azure/cosmos';
import { AzureCliCredential, ManagedIdentityCredential } from "@azure/identity";
import catchAsync from '../utility/catchAsync.js';

class AuditController {
    #credential = null;
    #client = null;

    constructor() { 
        const databaseEndpoint = "https://sreadmin.documents.azure.com:443/";
        const databaseId = "sreadmin";
        const containerId = "resources";
        this.#getCredential().then(credential => {
            this.#client = new CosmosClient({
                endpoint: databaseEndpoint,
                aadCredentials: credential
            });
            this.database = this.#client.database(databaseId);
            this.container = this.database.container(containerId);
        }).catch(error => {
            throw new Error("Could not get credentials: " + error.message);
        });
    }

    #getCredential = async () => {
        if (!this.#credential) {
            if (process.env.NODE_ENV === "development") { // running code locally? use the logged in user credential
                this.#credential = new AzureCliCredential();
            }
            else { // running in Azure Web App
                this.#credential = new ManagedIdentityCredential(process.env.MANAGED_IDENTITY_CLIENT_ID);
            }
        }
        return this.#credential;
    }

    list = catchAsync(async (req, res, next) => {
        const querySpec = {
            query: 'SELECT * FROM c'
        };

        const { resources: resources } = await this.container.items.query(querySpec).fetchAll();
        res.status(200).json({
            status: 'success',
            results: resources.length,
            data: resources
        });
    });

    filterBySubscriptionId = catchAsync(async (req, res, next) => {
        const { subscriptionId } = req.query;
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.subscriptionId = @subscriptionId',
            parameters: [
                { name: '@subscriptionId', value: subscriptionId }
            ]
        };

        const { resources: resources } = await this.container.items.query(querySpec).fetchAll();
        res.status(200).json({
            status: 'success',
            results: resources.length,
            data: resources
        });
    });

    filterByResourceType = catchAsync(async (req, res, next) => {
        const { resourceType } = req.query;
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.resourceType = @resourceType',
            parameters: [
                { name: '@resourceType', value: resourceType }
            ]
        };

        const { resources: resources } = await this.container.items.query(querySpec).fetchAll();
        res.status(200).json({
            status: 'success',
            results: resources.length,
            data: resources
        });
    });

    filterByAction = catchAsync(async (req, res, next) => {
        const { action } = req.query;
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.action = @action',
            parameters: [
                { name: '@action', value: action }
            ]
        };

        const { resources: resources } = await this.container.items.query(querySpec).fetchAll();
        res.status(200).json({
            status: 'success',
            results: resources.length,
            data: resources
        });
    });

    filterByStatus = catchAsync(async (req, res, next) => {
        const { status } = req.query;
        const querySpec = {
            query: 'SELECT * FROM c WHERE c.status = @status',
            parameters: [
                { name: '@status', value: status }
            ]
        };

        const { resources: resources } = await this.container.items.query(querySpec).fetchAll();
        res.status(200).json({
            status: 'success',
            results: resources.length,
            data: resources
        });
    });

    filterByMultipleFields = catchAsync(async (req, res, next) => {
        const { subscriptionId, resourceType, action, status, all } = req.query;
        let query = 'SELECT * FROM c WHERE 1=1';
        const parameters = [];
    
        if (subscriptionId) {
            query += ' AND c.subscriptionId = @subscriptionId';
            parameters.push({ name: '@subscriptionId', value: subscriptionId });
        }
        if (resourceType) {
            query += ' AND c.resourceType = @resourceType';
            parameters.push({ name: '@resourceType', value: resourceType });
        }
        if (action) {
            query += ' AND c.action = @action';
            parameters.push({ name: '@action', value: action });
        }
        if (status) {
            query += ' AND c.status = @status';
            parameters.push({ name: '@status', value: status });
        }
    
        // Add condition to filter data from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        query += ' AND c.actionOn >= @sevenDaysAgo';
        parameters.push({ name: '@sevenDaysAgo', value: sevenDaysAgo.toISOString() });
    
        // Add ORDER BY clause to sort results by actionOn in descending order
        query += ' ORDER BY c.actionOn DESC';
    
        const querySpec = {
            query,
            parameters
        };
    
        // Query the resources container
        const { resources: resourcesData } = await this.container.items.query(querySpec).fetchAll();
    
        let combinedResults = resourcesData;
    
        // If all=true, query the resources-internal container and combine results
        if (all === 'true') {
            const internalContainer = this.database.container('resources-internal');
            const { resources: internalResourcesData } = await internalContainer.items.query(querySpec).fetchAll();
            combinedResults = combinedResults.concat(internalResourcesData);
        }
    
        res.status(200).json({
            status: 'success',
            results: combinedResults.length,
            data: combinedResults
        });
    });
}

export default AuditController;
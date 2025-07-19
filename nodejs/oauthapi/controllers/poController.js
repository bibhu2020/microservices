import { CosmosClient } from '@azure/cosmos';
import { AzureCliCredential, ManagedIdentityCredential } from "@azure/identity";
import catchAsync from '../utility/catchAsync.js';

class POController {
    #credential = null;
    #client = null;

    constructor() { 
        const databaseEndpoint = process.env.COSMOS_DB_ENDPOINT;
        const databaseId = process.env.COSMOS_DB_DATABASE_ID;
        const containerId = "purchaseorders";
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

    create = catchAsync(async (req, res, next) => {
        try {
            const { submitter, vendorName, shippingAddress, lineItems } = req.body;
            const newPO = { submitter, vendorName, shippingAddress, lineItems, poStatus: 'Draft', createdAt: new Date(), lastUpdated:  new Date() };

            const { resource: createdPO } = await this.container.items.create(newPO);
            res.status(201).json({
                status: 'success',
                data: createdPO
            });
        } catch (error) {
            next(error);
        }
        
    });

    // vendorName was used as the partition key while creating the container. 
    // Hence, you must pass it in query to find the record.
    put = catchAsync(async (req, res, next) => {
        const { id, vendorName } = req.params;
        
        const { resource: existingPO } = await this.container.item(id, vendorName).read();
        if (!existingPO) {
            return res.status(404).json({
                status: 'fail',
                message: 'Purchase order not found'
            });
        }

        try {
            const { submitter, vendorName, shippingAddress, lineItems, poStatus, createdAt } = req.body;
            const updatedPO = { ...existingPO, submitter, vendorName, shippingAddress, lineItems, poStatus, createdAt, lastUpdated:  new Date() };
            const { resource: updatedResource } = await this.container.item(id, vendorName).replace(updatedPO);
    
            res.status(200).json({
                status: 'success',
                data: updatedResource
            });
        } catch (error) {
            next(error);
        }
    });

    delete = catchAsync(async (req, res, next) => {
        const { id, vendorName } = req.params;

        console.log('Deleting PO with ID: ', id);
        try {
            await this.container.item(id, vendorName).delete();
            res.status(204).json({
                status: 'success',
                data: null
            });
        } catch (error) {
            next(error);
        }
    });

    list = catchAsync(async (req, res, next) => {
        const querySpec = {
            query: 'SELECT * FROM c'
        };

        const { resources: purchaseOrders } = await this.container.items.query(querySpec).fetchAll();
        res.status(200).json({
            status: 'success',
            results: purchaseOrders.length,
            data: purchaseOrders
        });
    });
}

export default POController;
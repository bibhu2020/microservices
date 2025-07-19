import { EmailClient } from "@azure/communication-email";
import { AzureCliCredential, ManagedIdentityCredential } from "@azure/identity";
import catchAsync from '../utility/catchAsync.js'
import { ServiceBusClient } from "@azure/service-bus";

class GrafanaWebhookController {

    #sbQSender;
    #sbQName;
    #emailClient;
    #credential;

    constructor(){
    }

    #getQSender = async () => {
        if (!this.#sbQSender) {
            const sbNamespace = process.env.SERVICE_BUS_NAMESPACE;
            const credential = await this.#getCredential();
            const sbClient = new ServiceBusClient(sbNamespace,credential);
            this.#sbQName = process.env.SERVICE_BUS_QUEUE_NAME;
            this.#sbQSender = sbClient.createSender(this.#sbQName);
        }
        return this.#sbQSender;
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
        return this.#credential
    }

    #getEmailClient = async () => {
        if (!this.#emailClient) {
            const endpoint = process.env.COMMUNICATION_SERVICE_ENDPOINT;
            const credential = await this.#getCredential();
            this.#emailClient = new EmailClient(endpoint, credential);
        }
        return this.#emailClient;
    }

    sendEmail = catchAsync(async (req, res, next) => {
        try {
            const {title, message} = req.body;
            

            const client = await this.#getEmailClient();

            const sender = process.env.SENDER_EMAIL ? process.env.SENDER_EMAIL : "contentcomposer@gdcwebopsservice.microsoft.com";
            const recipients = process.env.RECIPIENTS ? process.env.RECIPIENTS : "v-bimishra@microsoft.com";

            const emailMessage = {
                senderAddress: sender,
                content: {
                    subject: title,
                    plainText: message,
                },
                recipients: {
                    to: [{ address: recipients }],
                },
            };
        
            const poller = await client.beginSend(emailMessage);
            const result = await poller.pollUntilDone();

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                status: 'success',
                data: {
                    message: result
                }
            });
        }catch (error) {
            console.error("An error occurred while listing the secrets:", error);
            next(error);
        }
    });
}
  
export default GrafanaWebhookController;
  
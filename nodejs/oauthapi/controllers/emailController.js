import { EmailClient } from "@azure/communication-email";
import { AzureCliCredential, ManagedIdentityCredential } from "@azure/identity";
import catchAsync from '../utility/catchAsync.js'
import { ServiceBusClient } from "@azure/service-bus";

class EmailController {

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
            const {emailFrom, emailTo, emailSubject, emailBody} = req.body;
            

            const client = await this.#getEmailClient();

            const emailMessage = {
                senderAddress: emailFrom ? emailFrom : process.env.SENDER_EMAIL,
                content: {
                    subject: emailSubject,
                    plainText: emailBody,
                },
                recipients: {
                    to: [{ address: emailTo }],
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

    sendEmailHtml = catchAsync(async (req, res, next) => {
        try {
            const {emailFrom, emailTo, emailSubject, emailBody} = req.body;

            const client = await this.#getEmailClient();

            const emailMessage = {
                senderAddress:  emailFrom ? emailFrom : process.env.SENDER_EMAIL,
                content: {
                    subject: emailSubject,
                    html: `${emailBody}`,
                },
                recipients: {
                    to: [{ address: emailTo }],
                },
            };

            console.log(emailMessage);
        
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
            console.error("An error occurred while sending email:", error);
            next(error);
        }
    });

    queueEmail = catchAsync(async (req, res, next) => {
        const {emailFrom, emailTo, emailSubject, emailBody} = req.body;
        const payload = {
            emailFrom: emailFrom,
            emailTo: emailTo,
            emailSubject: emailSubject,
            emailBody: emailBody,
            htmlMessage: false
        };

        try {
            // Create a Service Bus message
            const sbMessage = {
                body: payload,
                contentType: "application/json"
            };
    
            // Send the message to the queue
            const sender = await this.#getQSender();
            await sender.sendMessages(sbMessage);
            console.log(`Message sent to the queue: ${this.#sbQName}`);

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                status: 'success',
                data: {
                    message: "Email successfully queued."
                }
            });
        }
        catch (error) {
            console.error("An error occurred while writing to queue.", error);
            next(error);
        } finally {
           // await this.sender.close();
        }
    });

    queueEmailHtml = catchAsync(async (req, res, next) => {
        const {emailFrom, emailTo, emailSubject, emailBody} = req.body;
        const payload = {
            emailFrom: emailFrom,
            emailTo: emailTo,
            emailSubject: emailSubject,
            emailBody: emailBody,
            htmlMessage: true
        };

        try {
            // Create a Service Bus message
            const sbMessage = {
                body: payload,
                contentType: "application/json"
            };
    
            // Send the message to the queue
            const sender = await this.#getQSender();
            await sender.sendMessages(sbMessage);
            console.log(`Message sent to the queue: ${this.#sbQName}`);

            res.setHeader('Content-Type', 'application/json');
            res.status(200).json({
                status: 'success',
                data: {
                    message: "Email successfully queued."
                }
            });
        }
        catch (error) {
            console.error("An error occurred while writing to queue.", error);
            next(error);
        } finally {
            //await this.sender.close();
        }
    });
}
  
export default EmailController;
  
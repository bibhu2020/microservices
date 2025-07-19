import { ServiceBusClient } from '@azure/service-bus';
import { AzureCliCredential, ManagedIdentityCredential } from '@azure/identity';
import { processMessage } from './processMessage.js';

export async function readServiceBusQueue(log, errorLog) {
    let serviceBusClient;
    let receiver;
    try {

        // Retrieve the Service Bus namespace from environment variables
        const serviceBusNamespace = process.env.SERVICE_BUS_NAMESPACE;
        log(`Debug: Service Bus namespace: ${serviceBusNamespace}`);

        // Determine if running in Azure or locally
        const isRunningInAzure = process.env.WEBSITE_INSTANCE_ID !== undefined;

        // Create a ServiceBusClient using the appropriate credential
        const credential = isRunningInAzure ? new ManagedIdentityCredential(process.env.MANAGED_IDENTITY_CLIENT_ID) : new AzureCliCredential();
        serviceBusClient = new ServiceBusClient(serviceBusNamespace, credential);

        // Create a receiver for the queue
        const queueName = process.env.SERVICE_BUS_QUEUENAME;
        log(`Debug: Service Bus queue name: ${queueName}`);
        receiver = serviceBusClient.createReceiver(queueName);

        const messages = await receiver.receiveMessages(10, { maxWaitTimeInMs: 5000 });
        log(`Debug: Received ${messages.length} messages.`);
        if (messages.length === 0) {
           log('Debug: No messages received.');
        } else {
            for (const message of messages) {
                await processMessage(log, errorLog, message.body);

                // Complete the message after processing
                await receiver.completeMessage(message);
            }
        }
    } catch (err) {
        errorLog(`Debug: Error receiving messages: ${err.message}`, err);
    } finally {
        if (receiver) {
            await receiver.close();
        }
        if (serviceBusClient) {
            await serviceBusClient.close();
        }
    }
}
// This is a singleton class that wraps the ServiceBusClient class from the @azure/service-bus package.

import { ServiceBusClient } from "@azure/service-bus";
import { AzureCliCredential, ManagedIdentityCredential } from "@azure/identity";

class ServiceBusClientSingleton {
    static #instance = null;

    constructor(ServiceBusNameSpace) {
        if (ServiceBusClientSingleton.#instance) {
            throw new Error("Use ServiceBusClientSingleton.getInstance() to get an instance of this class.");
        }
        ServiceBusClientSingleton.getInstance(ServiceBusNameSpace);
    }

    static #getCredential = async () => {
        let credential;
        if (process.env.NODE_ENV === "development") { // running code locally? use the logged in user credential
            credential = new AzureCliCredential();
        }
        else { // running in Azure Web App
            credential = new ManagedIdentityCredential(process.env.MANAGED_IDENTITY_CLIENT_ID);
        }
        return credential;
    }

    static async getInstance(ServiceBusNameSpace) {
        if (!ServiceBusClientSingleton.#instance) {
            const credential = await this.#getCredential();
            ServiceBusClientSingleton.#instance = new ServiceBusClient(ServiceBusNameSpace, credential);
        }
        return ServiceBusClientSingleton.#instance;
    }

    async sendMessageToQueue(queueName, message) {
        const sender = ServiceBusClientSingleton.#instance.createSender(queueName);
        try {
            await sender.sendMessages({ body: message, contentType: "application/json" });
            console.log(`Message sent to queue: ${queueName}`);
        } finally {
            await sender.close();
        }
    }

    async receiveMessagesFromQueue(queueName, maxMessages = 1, removeMessages = true) {
        const receiver = ServiceBusClientSingleton.#instance.createReceiver(queueName);
        try {
            const messages = await receiver.receiveMessages(maxMessages);
            if (removeMessages) {
                for (const message of messages) {
                    await receiver.completeMessage(message);
                }
            }
            return messages;
        } finally {
            await receiver.close();
        }
    }

    async sendMessageToTopic(topicName, message) {
        const sender = ServiceBusClientSingleton.#instance.createSender(topicName);
        try {
            await sender.sendMessages({ body: message, contentType: "application/json" });
            console.log(`Message sent to topic: ${topicName}`);
        } finally {
            await sender.close();
        }
    }

    async receiveMessagesFromSubscription(topicName, subscriptionName, maxMessages = 1, removeMessages = true) {
        const receiver = ServiceBusClientSingleton.#instance.createReceiver(topicName, subscriptionName);
        try {
            const messages = await receiver.receiveMessages(maxMessages);
            if (removeMessages) {
                for (const message of messages) {
                    await receiver.completeMessage(message);
                }
            }
            return messages;
        } finally {
            await receiver.close();
        }
    }
}

export default ServiceBusClientSingleton;
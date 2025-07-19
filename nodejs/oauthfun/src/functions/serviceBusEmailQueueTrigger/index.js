import '../../../_utility/logger.js';
import { app } from "@azure/functions";
import { processMessage } from '../../../_utility/processMessage.js';

async function index(message, context) {
    const log = context.log ? context.log.bind(context) : console.log;
    const errorLog = context.log ? context.log.bind(context) : console.error;

    try {
        await processMessage(log, errorLog, message);
    } catch (error) {
        errorLog('Error processing message:', error);
    }

    log('Service Bus queue trigger function processed message:', message);
}

app.serviceBusQueue('serviceBusEmailQueueTrigger', {
    connection: "AzureWebJobsServiceBus", // Leave connection empty to use the custom ServiceBusClient
    queueName: process.env.SERVICE_BUS_QUEUENAME, // Name of the Service Bus queue
    handler: index
});

export default index;
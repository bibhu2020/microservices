import '../../../_utility/logger.js';
import { app } from "@azure/functions";
import { readServiceBusQueue } from '../../../_utility/readServiceBusQueue.js';

async function index(context, req) {
    const log = context.log ? context.log.bind(context) : console.log;
    const errorLog = context.log ? context.log.bind(context) : console.error;
    log("Service Bus: " + process.env.SERVICE_BUS_NAMESPACE);
    log("Service Queue: " + process.env.SERVICE_BUS_QUEUENAME);
    

    try {
        await readServiceBusQueue(log, errorLog);
        const responseMessage = `serviceBusEmailHttpTrigger triggered function executed successfully.`;
        return {
            status: 200,
            body: responseMessage
        };
    } catch (error) {
        errorLog('Debug: Error reading Service Bus queue:', error);
        return {
            status: 500,
            body: 'Internal Server Error'
        };
    }
}

app.hook.appStart((context) => {
    console.log('Debug: serviceBusEmailHttpTrigger started');
});

app.hook.appTerminate((context) => {
    console.log('Debug: serviceBusEmailHttpTrigger terminated');
});

app.http('serviceBusEmailHttpTrigger', {
    route: "serviceBusEmailHttpTrigger",
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: index
});

export default index;
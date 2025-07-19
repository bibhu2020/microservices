import '../../../_utility/logger.js';
import { app } from "@azure/functions";
import { readServiceBusQueue } from '../../../_utility/readServiceBusQueue.js';

const schedule = process.env.TIMER_SCHEDULE || '*/30 * * * * *';

async function index(myTimer, context) {
    const log = context.log ? context.log.bind(context) : console.log;
    const errorLog = context.log ? context.log.bind(context) : console.error;

    try {
        await readServiceBusQueue(log, errorLog);
    } catch (error) {
        errorLog('Error reading Service Bus queue:', error);
    }

    const currentTime = myTimer.scheduleStatus?.last || 'unknown time';
    log(`Timer function processed request at ${currentTime}.`);
}

app.timer('serviceBusEmailScheduledTrigger', {
    schedule: schedule,
    handler: index
});

export default index;
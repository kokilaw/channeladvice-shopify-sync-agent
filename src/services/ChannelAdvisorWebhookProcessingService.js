const { processOrder } = require('./OrderService');
const { endsWith } = require('lodash')

const processWebhook = async (webhookPayload) => {
    console.log(`CA webhook received - ${JSON.stringify(webhookPayload)}`)
    const { schema, payload } = webhookPayload;
    if (endsWith(schema, 'paymentcleared')) {
        return await processOrder(payload.ID)
    } else {
        console.warn(`Unsupported CA webhook received - schema[${schema}]`)
    }
    return {};
}

module.exports = {
    processWebhook
}
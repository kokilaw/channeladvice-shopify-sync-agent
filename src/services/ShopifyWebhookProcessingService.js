const channelAdvisorClient = require('../clients/channel-advisor/ChannelAdvisorClient')
const { getChannelAdvisorFulfillmentPayload } = require('../mapper/FulfillmentMapper');
const { getRequestByShopifyOrderId } = require('../repository/SyncOrderRequestRepository');

const processWebhook = async (webhookPayload) => {

    const { id, fulfillment_status } = webhookPayload;
    console.log(`Shopify webhook received - id[${id}] fulfillment_status[${fulfillment_status}] webhookPayload:[${JSON.stringify(webhookPayload)}]`)

    const isFulfilled = fulfillment_status === 'fulfilled';
    if (!isFulfilled) {
        console.log(`Skipping the shopify webhook - id[${id}]`)
    }

    const syncRequest = await getRequestByShopifyOrderId(webhookPayload.id);
    console.log(`Sync request for received order - id[${syncRequest.id}]`);
    const { caOrder: { Fulfillments } } = syncRequest;

    console.log(`Creating CA fulfillment for sync-request - ${syncRequest.id}`)
    const caFulfillmentPayload = await getChannelAdvisorFulfillmentPayload(webhookPayload)
    const response = await channelAdvisorClient.createOrderFulfillment(Fulfillments[0].ID, caFulfillmentPayload)

    console.log(`CA fulfillment response - ${JSON.stringify(response)}`)
    return {};
}

module.exports = {
    processWebhook
}
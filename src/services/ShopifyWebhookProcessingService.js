const channelAdvisorClient = require('../clients/channel-advisor/ChannelAdvisorClient')
const { getChannelAdvisorFulfillmentPayload } = require('../mapper/FulfillmentMapper');
const { getRequestByShopifyOrderId } = require('../repository/SyncOrderRequestRepository');

async function handleFullfilledWebhook(id, webhookPayload, isPartiallyFulfillment) {
    console.log(`Shopify orders/fulfilled webhook - id[${id}] webhookPayload:[${JSON.stringify(webhookPayload)}]`)

    const syncRequest = await getRequestByShopifyOrderId(webhookPayload.id);
    console.log(`Sync request for received order - id[${syncRequest.id}]`);
    const {caOrder: {Fulfillments}, shopifyCAOrderLineItemMapping } = syncRequest;

    console.log(`Creating CA fulfillment for sync-request - ${syncRequest.id}`)
    const caFulfillmentPayload = await getChannelAdvisorFulfillmentPayload(webhookPayload, shopifyCAOrderLineItemMapping)
    const response = isPartiallyFulfillment
        ? await channelAdvisorClient.createOrderFulfillment(caFulfillmentPayload)
        : await channelAdvisorClient.updateOrderFulfillment(Fulfillments[0].ID, caFulfillmentPayload)

    console.log(`CA fulfillment response - ${JSON.stringify(response)}`)
    return {};
}

const processWebhook = async (webhookTopic, webhookPayload) => {

    const { id } = webhookPayload;
    console.log(`Shopify webhook received - id[${id}] webhookTopic[${webhookTopic}]`)

    if (webhookTopic === 'orders/fulfilled') {
        return await handleFullfilledWebhook(id, webhookPayload, false);
    }

    if (webhookTopic === 'orders/partially_fulfilled') {
        return await handleFullfilledWebhook(id, webhookPayload, true);
    }

    if (webhookTopic === 'refunds/create') {

    }

}

module.exports = {
    processWebhook
}
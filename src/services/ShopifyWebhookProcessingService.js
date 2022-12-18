const channelAdvisorClient = require('../clients/channel-advisor/ChannelAdvisorClient')
const { getChannelAdvisorFulfillmentCreatePayload, getChannelAdvisorFulfillmentUpdatePayload } = require('../mapper/FulfillmentMapper');
const { getRequestByShopifyOrderId, saveNewSyncOrderRequest } = require('../repository/SyncOrderRequestRepository');

async function handleFullfilledWebhook(id, webhookPayload, isPartiallyFulfillment) {
    console.log(`Shopify orders/fulfilled webhook - id[${id}] webhookPayload:[${JSON.stringify(webhookPayload)}]`)

    const syncRequest = await getRequestByShopifyOrderId(webhookPayload.id);
    console.log(`Sync request for received order - id[${syncRequest.id}]`);
    const { caOrder: {ID: caOrderId, ProfileID: caProfileId, Fulfillments}, shopifyCALineItemsMapping, processedShopifyFulfillment = {} } = syncRequest;

    const shopifyFulfillmentsToProcess = getShopifyFulfillmentToProcess(webhookPayload.fulfillments, processedShopifyFulfillment);
    for (const shopifyFulfillmentToProcess of shopifyFulfillmentsToProcess) {

        const shopifyFulfillmentIdToProcess = shopifyFulfillmentToProcess.id;

        console.log(`Creating CA fulfillment for sync-request - ${syncRequest.id} shopifyFulfillmentToProcess[${JSON.stringify(shopifyFulfillmentToProcess)}]`)
        const caFulfillmentCreatePayload = await getChannelAdvisorFulfillmentCreatePayload(caOrderId, caProfileId, shopifyFulfillmentToProcess, shopifyCALineItemsMapping)
        const caFulfillmentUpdatePayload = await getChannelAdvisorFulfillmentUpdatePayload(shopifyFulfillmentToProcess)
        const response = isPartiallyFulfillment
            ? await channelAdvisorClient.createOrderFulfillment(caFulfillmentCreatePayload)
            : await channelAdvisorClient.updateOrderFulfillment(Fulfillments[0].ID, caFulfillmentUpdatePayload)

        console.log(`CA fulfillment response - ${JSON.stringify(response)}`)

        const updatedProcessedShopifyFulfillment = {
            ...processedShopifyFulfillment,
            [shopifyFulfillmentIdToProcess]: {
                caFulfillmentId: response.ID || ''
            }
        }

        console.log(`updatedProcessedShopifyFulfillment - ${JSON.stringify(updatedProcessedShopifyFulfillment)}`)

        await saveNewSyncOrderRequest({
            ...syncRequest,
            processedShopifyFulfillment: updatedProcessedShopifyFulfillment
        })

    }

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

    console.log(`Shopify webhook processed - id[${id}]`)

}

const getShopifyFulfillmentToProcess = (fulfillments, processedShopifyFulfillment) => {
    return fulfillments.filter(shopifyFulfillment => !(shopifyFulfillment.id in processedShopifyFulfillment))
}

module.exports = {
    processWebhook
}
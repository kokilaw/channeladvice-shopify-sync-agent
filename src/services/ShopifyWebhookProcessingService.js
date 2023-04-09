const channelAdvisorClient = require('../clients/channel-advisor/ChannelAdvisorClient')
const { getChannelAdvisorFulfillmentCreatePayload, getChannelAdvisorFulfillmentUpdatePayload } = require('../mapper/FulfillmentMapper');
const { getRequestByShopifyOrderId, saveNewSyncOrderRequest } = require('../repository/SyncOrderRequestRepository');

async function handleFullfilledWebhook(id, webhookPayload, isPartiallyFulfillment) {
    console.log(`Shopify orders/fulfilled webhook - id[${id}] webhookPayload:[${JSON.stringify(webhookPayload)}]`)

    const syncRequest = await getRequestByShopifyOrderId(webhookPayload.id);
    console.log(`Sync request for received order - id[${syncRequest.id}]`);
    const { caOrder: {ID: caOrderId, ProfileID: caProfileId, Fulfillments}, shopifyCALineItemsMapping, processedShopifyFulfillment = {} } = syncRequest;
    const mainCAFulfillment = await channelAdvisorClient.retrieveFulfillment(Fulfillments[0].ID);


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

        const newCAFulfillmentId = response.ID;
        if (isPartiallyFulfillment) {
            const itemsToMove = caFulfillmentCreatePayload.Items.map(item => {

                const fulfillmentItem = mainCAFulfillment.Items.filter(fulfillmentItem => fulfillmentItem.OrderItemID === item.OrderItemID)[0];

                return {
                    'FulfillmentItemID': fulfillmentItem.ID,
                    'DestinationFulfillmentID': newCAFulfillmentId,
                    'Quantity': item.Quantity
                }
            });

            for (const item of itemsToMove) {
                await channelAdvisorClient.moveFulfillmentItem(item['FulfillmentItemID'], {
                    'DestinationFulfillmentID': item['DestinationFulfillmentID'],
                    'Quantity': item['Quantity']
                });
            }

        }

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

async function handleRefundWebhook(id, webhookTopic, webhookPayload) {
    console.log(`Shopify refunds/create webhook - id[${id}] webhookPayload:[${JSON.stringify(webhookPayload)}]`)
    const { refund_line_items: refundLineItems } = webhookPayload;
    const syncRequest = await getRequestByShopifyOrderId(webhookPayload.order_id);
    const { shopifyCALineItemsMapping } = syncRequest;

    const itemsToRefund = refundLineItems.map(refundLineItem => {
        const caLineItem = shopifyCALineItemsMapping[refundLineItem.line_item_id];
        return {
            'OrderItemID': caLineItem.caOrderItemId,
            'Reason': 100,
            'Quantity': refundLineItem.quantity,
            'SellerAdjustmentID': refundLineItem.id,
        }
    })

    for (const itemToRefund of itemsToRefund) {
        await channelAdvisorClient.refundItem(itemToRefund['OrderItemID'], {
            Quantity: itemToRefund['Quantity'],
            SellerAdjustmentID: `Shopify-${itemToRefund['SellerAdjustmentID']}`
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
        return await handleRefundWebhook(id, webhookTopic, webhookPayload);
    }

    if (webhookTopic === 'products/create') {
        return await handleProductCreate(id, webhookPayload);
    }

    if (webhookTopic === 'products/update') {
        return await handleProductUpdate(id, webhookPayload);
    }

    if (webhookTopic === 'products/delete') {
        return await handleProductDelete(id, webhookPayload);
    }

    console.log(`Shopify webhook processed - id[${id}]`)

}

async function handleProductCreate(id, webhookPayload) {
    console.log(`Shopify products/create webhook - id[${id}] webhookPayload:[${JSON.stringify(webhookPayload)}]`);
}

async function handleProductUpdate(id, webhookPayload) {
    console.log(`Shopify products/update webhook - id[${id}] webhookPayload:[${JSON.stringify(webhookPayload)}]`);
}

async function handleProductDelete(id, webhookPayload) {
    console.log(`Shopify products/delete webhook - id[${id}] webhookPayload:[${JSON.stringify(webhookPayload)}]`);
}

const getShopifyFulfillmentToProcess = (fulfillments, processedShopifyFulfillment) => {
    return fulfillments.filter(shopifyFulfillment => !(shopifyFulfillment.id in processedShopifyFulfillment))
}

module.exports = {
    processWebhook
}
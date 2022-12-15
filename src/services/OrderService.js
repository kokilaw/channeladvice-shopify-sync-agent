const { isEmpty } = require('lodash')

const syncOrderRequestRepository = require('../repository/SyncOrderRequestRepository');
const channelAdvisorClient = require('../clients/channel-advisor/ChannelAdvisorClient');
const shopifyAdminAPIClient = require('../clients/shopify-admin-api/ShopifyAdminAPIClient');
const shopifyGraphQLClient = require('../clients/shopify-graphql/ShopifyGraphQLClient');
const orderMapper = require('../mapper/OrderMapper')
const paymentMapper = require('../mapper/PaymentMapper')

const { SYNC_ORDER_REQUEST_STATES } = require('../constant')


const processOrder = async (orderId) => {

    console.log(`Fetching CA order - orderId[${orderId}]`)
    const channelAdvisorOrder = await channelAdvisorClient.getOrderById(orderId);
    const caOrderItemsMapping = getCAOrderItemsMapping(channelAdvisorOrder.Items);

    console.log(`Fetching Shopify items based on CA order SKUs - orderId[${orderId}]`)
    const caOrderItemsSkus = Object.keys(caOrderItemsMapping);
    const shopifyItemsList = await shopifyGraphQLClient.getVariantsBySku(caOrderItemsSkus);
    const shopifyOrderItemsMapping = getShopifyOrderItemsMapping(shopifyItemsList);

    console.log(`Creating Shopify order - orderId[${orderId}]`)
    const shopifyOrderPayload = await orderMapper.getShopifyOrderPayload(channelAdvisorOrder, caOrderItemsMapping, shopifyOrderItemsMapping);
    const orderResponse = await shopifyAdminAPIClient.createOrder(shopifyOrderPayload)

    console.log(`Creating Shopify order payment - orderId[${orderId}]`)
    const { id: shopifyOrderId, line_items: shopifyOrderLineItems } = orderResponse;
    const shopifyPaymentPayload = await paymentMapper.getShopifyPaymentPayload(shopifyOrderId, channelAdvisorOrder)
    const paymentResponse = await shopifyAdminAPIClient.createPaymentForOrder(shopifyOrderId, shopifyPaymentPayload)

    console.log(`Saving sync-order-request - orderId[${orderId}]`)

    const shopifyOrderLineItemsMappingBySku = getShopifyOrderLineItemsMappingBySku(shopifyOrderLineItems);
    const shopifyCAOrderLineItemMapping = getShopifyCAOrderLineItemMapping(caOrderItemsMapping, shopifyOrderLineItemsMappingBySku);
    console.log(`Creating Shopify order payment - orderId[${orderId}] shopifyCAOrderLineItemMapping[${JSON.stringify(shopifyCAOrderLineItemMapping)}]`)
    await syncOrderRequestRepository.saveNewSyncOrderRequest({
        caOrderId: orderId,
        shopifyOrderId,
        caOrder: channelAdvisorOrder,
        shopifyOrder: orderResponse,
        shopifyPayment: paymentResponse,
        shopifyCAOrderLineItemMapping,
        status: SYNC_ORDER_REQUEST_STATES.ORDER_SYNC_COMPLETE
    });

    return {
        shopifyOrderId,
        transactionId: paymentResponse.id
    };

}

const getCAOrderItemsMapping = (items) => {
    if (isEmpty(items)) {
        throw 'CA items cannot be empty!'
    }
    const mapping = {};
    items.forEach(item => mapping[item.Sku] = item)
    return mapping;
}

const getShopifyOrderItemsMapping = (items) => {
    if (isEmpty(items)) {
        throw 'Shopify items cannot be empty!'
    }
    const mapping = {};
    items.forEach(item => mapping[item.sku] = item)
    return mapping;
}

const getShopifyOrderLineItemsMappingBySku = (items) => {
    if (isEmpty(items)) {
        throw 'Shopify line items cannot be empty!'
    }
    const mapping = {};
    items.forEach(item => mapping[item.sku] = { lineItemId: item.id, productId: item.product_id })
    return mapping;
}

const getShopifyCAOrderLineItemMapping = (caOrderItemMapping, shopifyOrderLineItemsMappingBySku) => {
    const shopifyOrderItemsSkus = Object.keys(shopifyOrderLineItemsMappingBySku);
    const mapping = {};
    shopifyOrderItemsSkus.forEach(shopifyOrderItemSku => mapping[shopifyOrderLineItemsMappingBySku[shopifyOrderItemSku].lineItemId] =
        {
            caOrderItemId: caOrderItemMapping[shopifyOrderItemSku].ID,
            caProductId: caOrderItemMapping[shopifyOrderItemSku].ProductID
        }
    );
    return mapping;
}

module.exports = {
    processOrder
}
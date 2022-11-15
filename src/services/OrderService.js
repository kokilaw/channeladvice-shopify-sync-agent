const { isEmpty } = require('lodash')

const channelAdvisorClient = require('../clients/channel-advisor/ChannelAdvisorClient');
const shopifyAdminAPIClient = require('../clients/shopify-admin-api/ShopifyAdminAPIClient');
const shopifyGraphQLClient = require('../clients/shopify-graphql/ShopifyGraphQLClient');
const orderMapper = require('../mapper/OrderMapper')
const paymentMapper = require('../mapper/PaymentMapper')


const processOrder = async (orderId) => {

    const channelAdvisorOrder = await channelAdvisorClient.getOrderById(orderId);
    const caOrderItemsMapping = getCAOrderItemsMapping(channelAdvisorOrder.Items);

    const caOrderItemsSkus = Object.keys(caOrderItemsMapping);
    const shopifyItemsList = await shopifyGraphQLClient.getVariantsBySku(caOrderItemsSkus);
    const shopifyOrderItemsMapping = getShopifyOrderItemsMapping(shopifyItemsList);

    const shopifyOrderPayload = await orderMapper.getShopifyOrderPayload(channelAdvisorOrder, caOrderItemsMapping, shopifyOrderItemsMapping);
    const orderResponse = await shopifyAdminAPIClient.createOrder(shopifyOrderPayload)

    const { id: shopifyOrderId } = orderResponse;
    const shopifyPaymentPayload = await paymentMapper.getShopifyPaymentPayload(shopifyOrderId, channelAdvisorOrder)
    const paymentResponse = await shopifyAdminAPIClient.createPaymentForOrder(shopifyOrderId, shopifyPaymentPayload)

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

module.exports = {
    processOrder
}
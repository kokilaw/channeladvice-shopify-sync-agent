const FirestoreClient = require('./client/FirestoreClient');
const uuid = require('uuid');

const { DB_COLLECTIONS } = require('../constant');


const saveNewSyncOrderRequest = async ({id, caOrderId, shopifyOrderId, caOrder, shopifyOrder, shopifyPayment, status, description, shopifyCALineItemsMapping}) => {
    await FirestoreClient.save(DB_COLLECTIONS.SYNC_ORDER_REQUEST, {
        id: id || uuid.v4(),
        caOrderId,
        shopifyOrderId: shopifyOrderId || '',
        caOrder: caOrder || {},
        shopifyOrder: shopifyOrder || {},
        shopifyPayment: shopifyPayment || {},
        status,
        shopifyCALineItemsMapping,
        description: description || ''
    })
}

const getRequestByShopifyOrderId = async (shopifyOrderId) => {
    const results = await FirestoreClient.get(DB_COLLECTIONS.SYNC_ORDER_REQUEST, 'shopifyOrderId', '==', shopifyOrderId)
    return results[0].data();
}

module.exports = {
    saveNewSyncOrderRequest,
    getRequestByShopifyOrderId
}
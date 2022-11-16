const axios = require('axios');
const { shopifyAPIConfigs } = require('../../configs/index')

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: shopifyAPIConfigs.shopifyGraphQLAPI(shopifyAPIConfigs.shopifyShopId),
    headers: {
        'X-Shopify-Access-Token': shopifyAPIConfigs.shopifyAdminApiToken,
        'Content-Type': 'application/json'
    }
});

module.exports = instance;
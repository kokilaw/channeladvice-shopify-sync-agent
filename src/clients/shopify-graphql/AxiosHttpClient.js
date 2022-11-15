const axios = require('axios');
const { channelAdvisorAPIConfigs } = require('../../configs/index')

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: channelAdvisorAPIConfigs.shopifyGraphQLAPI(channelAdvisorAPIConfigs.shopifyShopId),
    headers: {
        'X-Shopify-Access-Token': channelAdvisorAPIConfigs.shopifyAdminApiToken,
        'Content-Type': 'application/json'
    }
});

module.exports = instance;
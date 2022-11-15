
const channelAdvisorAPIConfigs = {
    channelAdvisorAPIUrl: 'https://api.channeladvisor.com',
    channelAdvisorApplicationId: process.env.CHANNEL_ADVISOR_APPLICATION_ID || '',
    channelAdvisorApplicationSecret: process.env.CHANNEL_ADVISOR_APPLICATION_SECRET || '',
    channelAdvisorRefreshToken: process.env.CHANNEL_ADVISOR_REFRESH_TOKEN || '',
    shopifyShopId: process.env.SHOPIFY_SHOP_ID || '',
    shopifyAdminApiToken: process.env.SHOPIFY_ADMIN_API_TOKEN || '',
    shopifyGraphQLAPI: (shopId) => `https://${shopId}.myshopify.com/admin/api/2022-10`,
    shopifyAdminAPI: (shopId) => `https://${shopId}.myshopify.com/admin/api/2022-10`
}

const shopifyAPIConfigs = {

}

module.exports = {
    channelAdvisorAPIConfigs,
    shopifyAPIConfigs
}
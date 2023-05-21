const {isNil} = require('lodash');

const ENVIRONMENT_VARIABLE_KEYS = {
    CHANNEL_ADVISOR_APPLICATION_ID: 'CHANNEL_ADVISOR_APPLICATION_ID',
    CHANNEL_ADVISOR_APPLICATION_SECRET: 'CHANNEL_ADVISOR_APPLICATION_SECRET',
    CHANNEL_ADVISOR_REFRESH_TOKEN: 'CHANNEL_ADVISOR_REFRESH_TOKEN',
    SHOPIFY_SHOP_ID: 'SHOPIFY_SHOP_ID',
    SHOPIFY_ADMIN_API_TOKEN: 'SHOPIFY_ADMIN_API_TOKEN',
    GOOGLE_CLOUD_PROJECT_ENV: 'GOOGLE_CLOUD_PROJECT_ENV',
    GOOGLE_CLOUD_PROJECT_ID: 'GOOGLE_CLOUD_PROJECT_ID',
    FREE_CURRENCY_API_KEY: 'FREE_CURRENCY_API_KEY',
}

const getConfigFromEnv = (key, isOptional) => {
    const envVariableValue = process.env[key];
    console.log(`Setting [${key}] as [${envVariableValue}]`)
    if (isNil(envVariableValue) && !isOptional) {
        const errorMessage = `Environment variable [${key}] is not set!`
        throw new Error(errorMessage);
    }
    return envVariableValue;
}

const channelAdvisorAPIConfigs = {
    channelAdvisorAPIUrl: 'https://api.channeladvisor.com',
    channelAdvisorApplicationId: getConfigFromEnv(ENVIRONMENT_VARIABLE_KEYS.CHANNEL_ADVISOR_APPLICATION_ID, false),
    channelAdvisorApplicationSecret: getConfigFromEnv(ENVIRONMENT_VARIABLE_KEYS.CHANNEL_ADVISOR_APPLICATION_SECRET, false),
    channelAdvisorRefreshToken: getConfigFromEnv(ENVIRONMENT_VARIABLE_KEYS.CHANNEL_ADVISOR_REFRESH_TOKEN, false),
}

const shopifyAPIConfigs = {
    shopifyShopId: getConfigFromEnv(ENVIRONMENT_VARIABLE_KEYS.SHOPIFY_SHOP_ID, false),
    shopifyAdminApiToken: getConfigFromEnv(ENVIRONMENT_VARIABLE_KEYS.SHOPIFY_ADMIN_API_TOKEN, false),
    shopifyGraphQLAPI: (shopId) => `https://${shopId}.myshopify.com/admin/api/2022-10`,
    shopifyAdminAPI: (shopId) => `https://${shopId}.myshopify.com/admin/api/2022-10`
}

const googleCloudConfig = {
    projectId: getConfigFromEnv(ENVIRONMENT_VARIABLE_KEYS.GOOGLE_CLOUD_PROJECT_ID, false),
    environment: getConfigFromEnv(ENVIRONMENT_VARIABLE_KEYS.GOOGLE_CLOUD_PROJECT_ENV, false)
}

const appConfig = {
    appPort: getConfigFromEnv('PORT', true) || 3000,
    runningEnv: getConfigFromEnv('RUNNING_ENV', true) || ''
}

const currencyApiConfig = {
    freeCurrencyApiUrl: 'https://api.freecurrencyapi.com/v1/latest',
    freeCurrencyApiKey: getConfigFromEnv(ENVIRONMENT_VARIABLE_KEYS.FREE_CURRENCY_API_KEY, false),
    shopifyCurrency: 'AUD'
}

module.exports = {
    channelAdvisorAPIConfigs,
    shopifyAPIConfigs,
    appConfig,
    googleCloudConfig,
    currencyApiConfig
}
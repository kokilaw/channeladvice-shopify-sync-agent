
const channelAdvisorAPIConfigs = {
    channelAdvisorAPIUrl: process.env.CHANNEL_ADVISOR_API_HOST || 'https://api.channeladvisor.com',
    applicationId: process.env.CHANNEL_ADVISOR_APPLICATION_ID || '',
    applicationSecret: process.env.CHANNEL_ADVISOR_APPLICATION_SECRET || '',
    refreshToken: process.env.CHANNEL_ADVISOR_REFRESH_TOKEN || ''
}

const shopifyAPIConfigs = {

}

module.exports = {
    channelAdvisorAPIConfigs,
    shopifyAPIConfigs
}
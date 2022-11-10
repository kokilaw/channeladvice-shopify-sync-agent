const channelAdvisorClient = require('../clients/channel-advisor/ChannelAdvisorClient');
const orderMapper = require('../mapper/OrderMapper')


const processOrder = async (orderId) => {
    const channelAdvisorOrder = await channelAdvisorClient.getOrderById(orderId);
    return await orderMapper.getShopifyOrderPayload(channelAdvisorOrder);
}

module.exports = {
    processOrder
}
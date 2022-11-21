const getChannelAdvisorFulfillmentPayload = async (shopifyWebhookOrder) => {
    const {fulfillments} = shopifyWebhookOrder;

    return {
        "DeliveryStatus": "Complete",
        "TrackingNumber": fulfillments[0].tracking_number,
        "ShippingCarrier": fulfillments[0].tracking_company,
        "ShippedDateUtc": new Date(fulfillments[0].updated_at).toISOString()

    }
}

module.exports = {
    getChannelAdvisorFulfillmentPayload
};
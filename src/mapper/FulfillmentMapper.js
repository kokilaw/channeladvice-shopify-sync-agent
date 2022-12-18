const getChannelAdvisorFulfillmentUpdatePayload = async (fulfillment) => {
    return {
        "DeliveryStatus": "Complete",
        "TrackingNumber": fulfillment.tracking_number,
        "ShippingCarrier": fulfillment.tracking_company,
        "ShippedDateUtc": new Date(fulfillment.updated_at).toISOString()
    }
}

const getChannelAdvisorFulfillmentCreatePayload = async (caOrderId, caProfileId, fulfillment, shopifyCALineItemsMapping) => {
    const { line_items: lineItems } = fulfillment;
    const caFulfillmentItems = lineItems.map(shopifyLineItem => {
        const caOrderItem = shopifyCALineItemsMapping[shopifyLineItem.id];
        return {
            'OrderItemID': caOrderItem.caOrderItemId,
            'Quantity': shopifyLineItem.quantity
        }
    })

    return {
        "OrderID": caOrderId,
        "ProfileID": caProfileId,
        "DeliveryStatus": "Complete",
        "TrackingNumber": fulfillment.tracking_number,
        "ShippingCarrier": fulfillment.tracking_company,
        "ShippedDateUtc": new Date(fulfillment.updated_at).toISOString(),
        "Items": caFulfillmentItems

    }
}

module.exports = {
    getChannelAdvisorFulfillmentUpdatePayload,
    getChannelAdvisorFulfillmentCreatePayload
};
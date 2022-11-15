

const getShopifyPaymentPayload = async (orderId, caOrder) => {
    return {
        kind: "sale",
        // TODO - Remove hardcoded values
        gateway: "The Market",
        status: "success",
        amount: caOrder.TotalPrice,
        currency: caOrder.Currency,
        source: "external"
    }
}

module.exports = {
    getShopifyPaymentPayload
};
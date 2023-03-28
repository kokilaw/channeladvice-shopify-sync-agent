const CurrencyUtils = require("../utils/CurrencyUtils");

const getShopifyPaymentPayload = async (orderId, caOrder) => {
    return {
        kind: "sale",
        // TODO - Remove hardcoded values
        gateway: "The Market",
        status: "success",
        amount: CurrencyUtils.convertPrice(caOrder.TotalPrice),
        currency: CurrencyUtils.getShopifyCurrency(),
        source: "external"
    }
}

module.exports = {
    getShopifyPaymentPayload
};
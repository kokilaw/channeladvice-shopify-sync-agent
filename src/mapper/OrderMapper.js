const parsePhoneNumber = require('libphonenumber-js')
const CurrencyUtils = require("../utils/CurrencyUtils");

const getShopifyOrderPayload = async (channelAdvisorOrder, caOrderItemsMapping, shopifyOrderItemsMapping) => {
    await CurrencyUtils.initCurrencyRate(channelAdvisorOrder);
    const customer = getCustomer(channelAdvisorOrder);
    const line_items = getLineItems(channelAdvisorOrder.Items, caOrderItemsMapping, shopifyOrderItemsMapping)

    return {
        note: getNote(channelAdvisorOrder),
        tags: channelAdvisorOrder.SiteName,
        contact_email: channelAdvisorOrder.BuyerEmailAddress,
        email: channelAdvisorOrder.BuyerEmailAddress,
        customer,
        line_items,
        // TODO - Remove hardcoded values
        payment_gateway_names: ["The Market"],
        taxes_included: true,
        currency: CurrencyUtils.getShopifyCurrency(),
        total_tax: CurrencyUtils.convertPrice(channelAdvisorOrder.TotalTaxPrice),
        subtotal_price: CurrencyUtils.convertPrice(channelAdvisorOrder.TotalPrice),
        total_price: CurrencyUtils.convertPrice(channelAdvisorOrder.TotalPrice),
        tax_lines: [{
            price: CurrencyUtils.convertPrice(channelAdvisorOrder.TotalTaxPrice),
            title: 'Tax'
        }],
        shipping_address: {...customer.default_address},
        shipping_lines: [{
            code: "custom",
            price: CurrencyUtils.convertPrice(channelAdvisorOrder.TotalShippingPrice),
            // TODO - Remove hardcoded values
            title: getShippingTitle(channelAdvisorOrder), //"The Market Standard"
            tax_lines: [{
                price: CurrencyUtils.convertPrice(channelAdvisorOrder.TotalShippingTaxPrice),
                rate: 0,
                title: 'Shipping Tax',
            }]
        }]
    }
}

const getNote = (channelAdvisorOrder) => {
    var note = `[CA OrderId:${channelAdvisorOrder.ID}]\n[Site OrderId:${channelAdvisorOrder.SiteOrderID}]`;
    if (channelAdvisorOrder.Fulfillments[0]?.TrackingNumber) note = `${note}\n[Carrier Tracking Number:${channelAdvisorOrder.Fulfillments[0]?.TrackingNumber}]`
    if (channelAdvisorOrder.Fulfillments[0]?.TrackingUrl) note = `${note}\n[Carrier Tracking URL:${channelAdvisorOrder.Fulfillments[0]?.TrackingUrl}]`
    return note;
}

const getShippingTitle = (channelAdvisorOrder) => {
    var shippingTitle = "";
    if (channelAdvisorOrder.Fulfillments[0]?.ShippingCarrier) {
        shippingTitle = `${channelAdvisorOrder.Fulfillments[0]?.ShippingCarrier} `;
    }
    if (channelAdvisorOrder.Fulfillments[0]?.ShippingClass) {
        shippingTitle = shippingTitle + channelAdvisorOrder.Fulfillments[0]?.ShippingClass;
    }
    return shippingTitle ? shippingTitle : "Default";
}

const getLineItems = (caOrderItems, caOrderItemsMapping, shopifyOrderItemsMapping) => {
    return caOrderItems.map(caOrderItem => {
        const sku = caOrderItem.Sku;
        const shopifyOrderItem = shopifyOrderItemsMapping[sku];
        return {
            variant_id: extractShopifyVariationId(shopifyOrderItem.id),
            quantity: caOrderItem.Quantity,
            price: CurrencyUtils.convertPrice(caOrderItem.UnitPrice)
        }
    })
}

const getCustomer = (channelAdvisorOrder) => {
    const {
        ShippingFirstName,
        ShippingLastName,
        BuyerEmailAddress,
        ShippingDaytimePhone,
        ShippingAddressLine1,
        ShippingAddressLine2,
        ShippingCity,
        ShippingStateOrProvinceName,
        ShippingCountry,
        ShippingPostalCode
    } = channelAdvisorOrder;
    return {
        email: BuyerEmailAddress,
        first_name: ShippingFirstName,
        last_name: ShippingLastName,
        phone: formatPhoneNumber(ShippingDaytimePhone, ShippingCountry),
        default_address: {
            first_name: ShippingFirstName,
            last_name: ShippingLastName,
            address1: `${ShippingAddressLine1 ? ShippingAddressLine1 + ', ' : ''}${ShippingAddressLine2}`,
            city: ShippingCity,
            province: ShippingStateOrProvinceName,
            zip: ShippingPostalCode,
            phone: formatPhoneNumber(ShippingDaytimePhone, ShippingCountry),
            name: `${ShippingFirstName} ${ShippingLastName}`,
            province_code: ShippingStateOrProvinceName,
            country_code: ShippingCountry,
        }
    }
}

const formatPhoneNumber = (phoneNumber, countryCode) => {
    if (phoneNumber === '555-555-5555' || !phoneNumber) {
        return `+640204${randomNumber(7)}`;
    }
    return parsePhoneNumber(phoneNumber, countryCode).number;
}

function randomNumber(length) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
}

const extractShopifyVariationId = (rawId) => {
    const results = rawId.split("/")
    return results[results.length - 1]
}

module.exports = {
    getShopifyOrderPayload
};
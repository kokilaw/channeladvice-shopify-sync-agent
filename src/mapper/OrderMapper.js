const parsePhoneNumber = require('libphonenumber-js')

const getShopifyOrderPayload = async (channelAdvisorOrder, caOrderItemsMapping, shopifyOrderItemsMapping) => {
    const customer = getCustomer(channelAdvisorOrder);
    const line_items = getLineItems(channelAdvisorOrder.Items, caOrderItemsMapping, shopifyOrderItemsMapping)
    return {
        // TODO - Check whether market place order Id can be passed
        note: `[Test Order Please Ignore] CA OrderId:${channelAdvisorOrder.ID}`,
        tags: channelAdvisorOrder.SiteName,
        contact_email: channelAdvisorOrder.BuyerEmailAddress,
        email: channelAdvisorOrder.BuyerEmailAddress,
        customer,
        line_items,
        // TODO - Remove hardcoded values
        payment_gateway_names: [ "The Market" ],
        taxes_included: true,
        currency: channelAdvisorOrder.Currency,
        total_tax: channelAdvisorOrder.TotalTaxPrice,
        subtotal_price: channelAdvisorOrder.TotalPrice,
        total_price: channelAdvisorOrder.TotalPrice,
        tax_lines: [{
            price: channelAdvisorOrder.TotalTaxPrice,
            title: 'Tax'
        }],
        shipping_address: { ...customer.default_address },
        shipping_lines: [{
            code: "custom",
            price: channelAdvisorOrder.TotalShippingPrice,
            // TODO - Remove hardcoded values
            title: "The Market Standard",
            tax_lines: [{
                price: channelAdvisorOrder.TotalShippingTaxPrice,
                rate: 0,
                title: 'Shipping Tax',
            }]
        }]
    }
}

const getLineItems = (caOrderItems, caOrderItemsMapping, shopifyOrderItemsMapping) => {
    return caOrderItems.map(caOrderItem => {
        const sku = caOrderItem.Sku;
        const shopifyOrderItem = shopifyOrderItemsMapping[sku];
        return {
            variant_id: extractShopifyVariationId(shopifyOrderItem.id),
            quantity: caOrderItem.Quantity,
            price: caOrderItem.UnitPrice
        }
    })
}

const getCustomer = (channelAdvisorOrder) => {
    const {ShippingFirstName, ShippingLastName, BuyerEmailAddress, ShippingDaytimePhone, ShippingAddressLine2, ShippingCity, ShippingStateOrProvinceName, ShippingCountry, ShippingPostalCode} = channelAdvisorOrder;
    return {
        email: BuyerEmailAddress,
        first_name: ShippingFirstName,
        last_name: ShippingLastName,
        phone: formatPhoneNumber(ShippingDaytimePhone, ShippingCountry),
        default_address: {
            first_name: ShippingFirstName,
            last_name: ShippingLastName,
            address1: ShippingAddressLine2,
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
    if (phoneNumber === '555-555-5555') {
        return `+640204${randomNumber(7)}`;
    }
    return parsePhoneNumber(phoneNumber, countryCode).number;
}

function randomNumber(length) {
    return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
}

const extractShopifyVariationId = (rawId) => {
    const results = rawId.split("/")
    return results[results.length -1]
}

module.exports = {
    getShopifyOrderPayload
};
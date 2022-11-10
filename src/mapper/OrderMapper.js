const getShopifyOrderPayload = async (channelAdvisorOrder) => {
    const customer = getCustomer(channelAdvisorOrder);
    return {
        note: `CA OrderId:${channelAdvisorOrder.ID}`,
        tags: channelAdvisorOrder.SiteName,
        customer
    }
}

const getCustomer = (channelAdvisorOrder) => {
    const {ShippingFirstName, ShippingLastName, BuyerEmailAddress, ShippingDaytimePhone, ShippingAddressLine2, ShippingCity, ShippingStateOrProvinceName, ShippingCountry, ShippingPostalCode} = channelAdvisorOrder;
    return {
        email: BuyerEmailAddress,
        first_name: ShippingFirstName,
        last_name: ShippingLastName,
        phone: ShippingDaytimePhone,
        default_address: {
            first_name: ShippingFirstName,
            last_name: ShippingLastName,
            address1: ShippingAddressLine2,
            city: ShippingCity,
            province: ShippingStateOrProvinceName,
            country: ShippingCountry,
            zip: ShippingPostalCode,
            phone: ShippingDaytimePhone,
            name: `${ShippingFirstName} ${ShippingLastName}`,
            province_code: ShippingStateOrProvinceName,
            country_code: ShippingCountry,
            country_name: ShippingCountry,
        }
    }
}

module.exports = {
    getShopifyOrderPayload
};
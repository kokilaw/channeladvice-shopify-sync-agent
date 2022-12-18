const axiosHttpClient = require('./AxiosHttpClient')


const createOrder = async (payload) => {
    console.log(`[ShopifyAdminAPIClient] createOrder - payload:[${JSON.stringify(payload)}]`)
    try {
        const { data } = await axiosHttpClient.post('/orders.json', { order: payload });
        console.log(`[ShopifyAdminAPIClient] createOrder - response:[${JSON.stringify(data)}]`)
        return data.order;
    } catch (e) {
        console.log(JSON.stringify(e.response.data.errors));
        throw e;
    }
}

const createPaymentForOrder = async (orderId, payload) => {
    console.log(`[ShopifyAdminAPIClient] createPaymentForOrder - orderId[${orderId}] payload:[${JSON.stringify(payload)}]`)
    try {
        const { data } = await axiosHttpClient.post(`/orders/${orderId}/transactions.json`, { transaction: payload });
        console.log(`[ShopifyAdminAPIClient] createPaymentForOrder - response:[${JSON.stringify(data)}]`)
        return data;
    } catch (e) {
        console.log(JSON.stringify(e.response.data.errors));
        throw e;
    }
}

module.exports = {
    createOrder,
    createPaymentForOrder
}
const axiosHttpClient = require('./AxiosHttpClient')


const createOrder = async (payload) => {
    try {
        const { data } = await axiosHttpClient.post('/orders.json', { order: payload });
        return data.order;
    } catch (e) {
        console.log(JSON.stringify(e.response.data.errors))
    }
}

const createPaymentForOrder = async (orderId, payload) => {
    try {
        const { data } = await axiosHttpClient.post(`/orders/${orderId}/transactions.json`, { transaction: payload });
        return data;
    } catch (e) {
        console.log(JSON.stringify(e.response.data.errors))
    }
}

module.exports = {
    createOrder,
    createPaymentForOrder
}
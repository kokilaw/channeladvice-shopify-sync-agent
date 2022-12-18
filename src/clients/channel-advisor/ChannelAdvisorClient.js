const axiosHttpClient = require('./AxiosHttpClient');
const querystring = require('querystring');

const { channelAdvisorAPIConfigs } = require('../../configs')

const getToken = async () =>  {

    const applicationId = channelAdvisorAPIConfigs.channelAdvisorApplicationId;
    const applicationSecret = channelAdvisorAPIConfigs.channelAdvisorApplicationSecret;
    const refreshToken = channelAdvisorAPIConfigs.channelAdvisorRefreshToken;

    const basicRawKey = `${applicationId}:${applicationSecret}`;
    const base64EncodedBasicKey = btoa(basicRawKey);

    const { data: { access_token } } = await axiosHttpClient.post(
        '/oauth2/token',
        querystring.stringify({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        }),
        {
        headers: {
            'Authorization': `Basic ${base64EncodedBasicKey}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return access_token;

}

const getOrderById = async (orderId) => {
    const accessToken = await getToken();
    const { data } = await axiosHttpClient.get(`/v1/orders/${orderId}?$expand=Items,Fulfillments`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    });
    return data;
}

const createOrderFulfillment = async (payload) => {
    console.log(`[ChannelAdvisorClient] createOrderFulfillment - payload:[${JSON.stringify(payload)}]`)
    const accessToken = await getToken();
    try {
        const { data } = await axiosHttpClient.post(`/v1/Fulfillments`, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return data;
    } catch (e) {
        console.log(JSON.stringify(e.response.data));
        throw e;
    }

}

const updateOrderFulfillment = async (fulfillmentId, payload) => {
    console.log(`[ChannelAdvisorClient] updateOrderFulfillment - fulfillmentId[${fulfillmentId}] payload:[${JSON.stringify(payload)}]`)
    const accessToken = await getToken();
    try {
        const { data } = await axiosHttpClient.put(`/v1/Fulfillments(${fulfillmentId})`, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return data;
    } catch (e) {
        console.log(JSON.stringify(e.response.data));
        throw e;
    }

}

const retrieveFulfillment = async (fulfillmentItemId) => {
    console.log(`[ChannelAdvisorClient] retrieveFulfillment - fulfillmentItemId[${fulfillmentItemId}]`)
    const accessToken = await getToken();
    try {
        const { data } = await axiosHttpClient.get(`/v1/Fulfillments(${fulfillmentItemId})?$expand=Items`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return data;
    } catch (e) {
        console.log(JSON.stringify(e.response.data));
        throw e;
    }

}

const moveFulfillmentItem = async (fulfillmentItemId, payload) => {
    console.log(`[ChannelAdvisorClient] moveFulfillmentItem - fulfillmentItemId[${fulfillmentItemId}] payload:[${JSON.stringify(payload)}]`)
    const accessToken = await getToken();
    try {
        const { data } = await axiosHttpClient.post(`/v1/FulfillmentItems(${fulfillmentItemId})/Move`, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return data;
    } catch (e) {
        console.log(JSON.stringify(e.response.data));
        throw e;
    }

}

module.exports = {
    getOrderById,
    createOrderFulfillment,
    updateOrderFulfillment,
    moveFulfillmentItem,
    retrieveFulfillment
}
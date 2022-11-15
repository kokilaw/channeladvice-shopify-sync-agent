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

module.exports = {
    getOrderById
}
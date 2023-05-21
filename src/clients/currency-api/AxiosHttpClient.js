const axios = require('axios');
const { currencyApiConfig } = require('../../configs/index')

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: currencyApiConfig.freeCurrencyApiUrl,
    headers:{
        apikey:currencyApiConfig.freeCurrencyApiKey
    }
});

module.exports = instance;
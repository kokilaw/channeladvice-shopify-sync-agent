const axios = require('axios');
const { channelAdvisorAPIConfigs } = require('../../configs/index')

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: channelAdvisorAPIConfigs.channelAdvisorAPIUrl
});

module.exports = instance;
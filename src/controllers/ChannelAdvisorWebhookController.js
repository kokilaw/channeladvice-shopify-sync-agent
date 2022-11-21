const { processWebhook } = require('../services/ChannelAdvisorWebhookProcessingService')

async function post(req, res, next) {
    try {
        res.json(await processWebhook(req.body));
    } catch (err) {
        console.error(`Error while channel-advisor webhook`, JSON.stringify(err));
        next(err);
    }
}

module.exports = {
    post
}
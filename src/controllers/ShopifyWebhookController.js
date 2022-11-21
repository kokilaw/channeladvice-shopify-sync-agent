const { processWebhook } = require('../services/ShopifyWebhookProcessingService')

async function post(req, res, next) {
    try {
        res.json(await processWebhook(req.body));
    } catch (err) {
        console.error(`Error while handling shopify webhook`, JSON.stringify(err));
        next(err);
    }
}

module.exports = {
    post
}
const express = require('express');
const router = express.Router();
const channelAdvisorWebhookController = require('../controllers/ChannelAdvisorWebhookController');
const shopifyWebhookController = require('../controllers/ShopifyWebhookController');

router.post('/channel-advisor', channelAdvisorWebhookController.post);
router.get('/channel-advisor', channelAdvisorWebhookController.get);
router.post('/shopify', shopifyWebhookController.post);
router.get('/shopify', shopifyWebhookController.get);

module.exports = router;
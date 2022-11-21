const express = require('express');
const router = express.Router();
const channelAdvisorWebhookController = require('../controllers/ChannelAdvisorWebhookController');
const shopifyWebhookController = require('../controllers/ShopifyWebhookController');

router.post('/channel-advisor', channelAdvisorWebhookController.post);
router.post('/shopify', shopifyWebhookController.post);

module.exports = router;
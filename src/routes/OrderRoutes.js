const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');

router.post('/:orderId', orderController.post);

module.exports = router;
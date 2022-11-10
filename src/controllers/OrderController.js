const orderService = require('../services/OrderService');

async function post(req, res, next) {
    try {
        res.json(await orderService.processOrder(req.params.orderId));
    } catch (err) {
        console.error(`Error while processing order`, err.message);
        next(err);
    }
}

module.exports = {
    post
}
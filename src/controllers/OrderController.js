const orderService = require('../services/OrderService');

async function post(req, res, next) {
    try {
        res.json(await orderService.processOrder(req.params.orderId));
    } catch (err) {
        console.error(`Error while processing order`, JSON.stringify(err));
        next(err);
    }
}

module.exports = {
    post
}
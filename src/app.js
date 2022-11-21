const app = require('express')()
const bodyParser = require('body-parser');
require('dotenv').config();

const { appConfig } = require('./configs/index')

const orderRoutes = require('./routes/OrderRoutes')
const webhookRoutes = require('./routes/WebhookRoutes')

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/orders/process', orderRoutes);
app.use('/webhooks', webhookRoutes);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});
});

if (appConfig.runningEnv === 'local') {
    app.listen(appConfig.appPort, () => {
        console.log(`Example app listening on port ${appConfig.appPort}`)
    })
}

module.exports = {
    app
};
const app = require('express')()
const bodyParser = require('body-parser');
require('dotenv').config();

const orderRoutes = require('./routes/OrderRoutes')

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

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});
});

module.exports = {
    app
};
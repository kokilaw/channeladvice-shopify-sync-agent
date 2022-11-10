const express = require('express')
const bodyParser = require('body-parser');
const app = express()
require('dotenv').config();
const port = process.env.PORT || 3000

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
app.use((err, req, res) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
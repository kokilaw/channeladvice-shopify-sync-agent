const axiosHttpClient = require('./AxiosHttpClient');

const getCurrencyRate = async (baseCurrency, shopifyCurrency) => {

    try {
        const {data} = await axiosHttpClient.get(`?currencies=${shopifyCurrency}&base_currency=${baseCurrency}`);
        const rate = data.data?.[shopifyCurrency];
        if (rate) console.log(`Currency rate fetched successfully, 1${baseCurrency}=${rate}${shopifyCurrency}`)
        return data.data?.[shopifyCurrency];
    } catch (err) {
        console.error(`Error while fetching currency rate`, JSON.stringify(err));
        return null;
    }
}

module.exports = {
    getCurrencyRate
}
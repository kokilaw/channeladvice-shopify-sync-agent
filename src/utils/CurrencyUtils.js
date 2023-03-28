const {currencyApiConfig} = require('../configs')
const {getCurrencyRate} = require("../clients/currency-api/CurrencyApiClient");

class CurrencyUtils {

    constructor() {
    }

    convertPrice(price) {
        return (this.currencyRate) ? this.round(price * this.currencyRate) : price;
    }

    round(num) {
        return Math.round(num * 100) / 100
    }

    getShopifyCurrency() {
        return currencyApiConfig.shopifyCurrency;
    }

    async initCurrencyRate(channelAdvisorOrder) {
        this.currencyRate = await getCurrencyRate(channelAdvisorOrder.Currency, this.getShopifyCurrency());
    }

}

module.exports = new CurrencyUtils();
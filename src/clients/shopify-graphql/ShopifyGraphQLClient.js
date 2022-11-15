const axiosHttpClient = require('./AxiosHttpClient');

const getSkuQueryString = (productSkus) => {
    if (Array.isArray(productSkus)) {
        const skuQueries = productSkus.map(sku => `sku:${sku}`)
        return { skuQueryString: skuQueries.join(" OR "), numberOfResults: skuQueries.length }
    }
    return { skuQueryString: `sku:${productSkus}`, numberOfResults: 1 };
}

const searchProductQueryPayload = (productSkus) => {
    const { skuQueryString, numberOfResults } = getSkuQueryString(productSkus)
    return JSON.stringify({
        query: `{\n	products(first:${numberOfResults}, query:\"${skuQueryString}\") {\n    edges {\n      node {\n        id\n        title\n        status\n        variants(first:1) {\n          edges {\n            node {\n              sku\n              id\n              title\n            }\n          }\n        }\n      }\n    }\n  }\n}\n`,
        variables: {}
    })
}

const searchVariantQueryPayload = (productSkus) => {
    const { skuQueryString, numberOfResults } = getSkuQueryString(productSkus)
    return JSON.stringify({
        query: `{\n	productVariants(first:${numberOfResults}, query:\"${skuQueryString}\") {\n    edges {\n      node {\n                sku\n              id\n              title\n      }\n    }\n  }\n}\n`,
        variables: {}
    });
}

const getProductsBySku = async (productSkus) => {
    const payload = searchProductQueryPayload(productSkus)
    const { data } = await axiosHttpClient.post('/graphql.json', payload);
    return data.data.products.edges
        .flatMap(entry => entry.node)
        .map(product => {
            const variants = product.variants.edges.flatMap(entry => entry.node)
            return {...product, variants}
        });
}

const getVariantsBySku = async (productSkus) => {
    const payload = searchVariantQueryPayload(productSkus)
    const { data } = await axiosHttpClient.post('/graphql.json', payload);
    return data.data.productVariants.edges.flatMap(entry => entry.node);
}

module.exports = {
    getProductsBySku,
    getVariantsBySku
}
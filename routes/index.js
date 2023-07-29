const express = require('express');
const app = require('../server.js');
const redisClient = require('../utils/redis.js');
require('dotenv').config();


const router = express.Router();


router.get('/', (req, res) => {
    res.send('Hello World!');
});

router.get('/cryptos', (req, res) => {
    fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=KES', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        }
    })
    .then(response => response.json())
    .then(data => {
        res.json(data);
    })
})


router.get('/crypto/dropdownprices', (req, res) => {
    fetch('https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=BTC,ETH&convert=KES', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        }
    })
    .then(response => response.json())
    .then(data => {
        priceBTC  = data.data.BTC[0].quote.KES.price
        priceETH = data.data.ETH[0].quote.KES.price
        res.json({
            'BTC': priceBTC,
            'ETH': priceETH,
        });
    })
});

router.get('/crypto/trendinglist', async(req, res) => {
    const trendinglist = [];
    const cachedData = await redisClient.get('trendinglist');
    if (cachedData){
        res.json({trendinglist: JSON.parse(cachedData)});
    } else {
        await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?convert=KES&limit=5', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
            }
        })
        .then(response => response.json())
        .then(async(data) => {
            for (let i = 0; i < data.data.length; i++){
                const item = data.data[i];
                const { id, name, symbol } = item;
                const {price, percent_change_24h} = item.quote.KES;
                await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
                    }
                })
                .then(response2 => response2.json())
                .then(data2 => {
                    let logoUrl = data2.data[id].logo;
                    trendinglist.push({
                        'name': name,
                        'symbol': symbol,
                        'price': price,
                        'percent_change_24h': percent_change_24h,
                        'logo': logoUrl
                    })
                })
                .catch(err => {
                    console.error(err);
                })
            }
            await redisClient.set('trendinglist', JSON.stringify(trendinglist), 1800);
            res.json({
                trendinglist
            })
        })
        .catch(err => {
            console.error(err);
        })
    }
});

router.get('/crypto/recents', async(req, res) => {
    const recents = [];
    const cachedData = await redisClient.get('recents');
    if (cachedData) {
        res.json({recents: JSON.parse(cachedData)});
    } else {
        await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5&convert=KES&sort=date_added', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
            }
        })
        .then(response => response.json())
        .then(async(data) => {
            for (let i = 0; i < data.data.length; i++){
                const item = data.data[i];
                const { id, name, symbol } = item;
                const { price, percent_change_24h } = item.quote.KES;
                await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
                    }
                })
                .then(response2 => response2.json())
                .then(data2 => {
                    let logoUrl = data2.data[id].logo;
                    recents.push({
                        'name': name,
                        'symbol': symbol,
                        'price': price,
                        'percent_change_24h': percent_change_24h,
                        'logo': logoUrl
                    })
                })
                .catch(err => {
                    console.error(err);
                }) 
            }
            await redisClient.set('recents', JSON.stringify(recents), 1800)
            res.json({
                recents
            })
        })
        .catch(err => {
            console.error(err)
        })
    }
});

router.get('/crypto/gainers', async(req, res) => {
    const gainers = [];
    const cachedData = await redisClient.get('gainers');
    if (cachedData) {
        res.json({gainers: JSON.parse(cachedData)});
    } else {
        await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5&convert=KES&sort=percent_change_24h', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
            }
        })
            .then((response) => response.json())
            .then(async(data ) => {
                for (let i = 0; i < data.data.length; i++){
                    const item = data.data[i];
                    const { id, name, symbol } = item;
                    const { price, percent_change_24h } = item.quote.KES;
                    await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
                        }
                    })
                    .then(response2 => response2.json())
                    .then(data2 => {
                        let logoUrl = data2.data[id].logo;
                        gainers.push({
                            'name': name,
                            'symbol': symbol,
                            'price': price,
                            'percent_change_24h': percent_change_24h,
                            'logo': logoUrl
                        })
                    })
                    .catch(err => {
                        console.error(err)
                    })
                }
                await redisClient.set('gainers', JSON.stringify(gainers), 1800)
                res.json({gainers})
            })
            .catch(err => {
                console.error(err)
            })
        }
    });

    router.get('/crypto/market-cap', async(req, res) => {
        const marketcap = [];
        const cachedData = await redisClient.get('marketcap');
        if (cachedData) {
            res.json({marketcap: JSON.parse(cachedData)});
        } else {
            await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5&convert=KES&sort=market_cap', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
                }
            })
                .then((response) => response.json())
                .then(async(data) => {
                    for (let i = 0; i < data.data.length; i++){
                        const item = data.data[i];
                        const { id, name, symbol } = item;
                        const { price, percent_change_24h } = item.quote.KES;
                            await fetch(`https://pro-api.coinmarketcap.com/v2/cryptocurrency/info?id=${id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
                            }
                        })
                        .then(response2 => response2.json())
                        .then(data2 => {
                            let logoUrl = data2.data[id].logo;
                            marketcap.push({
                                'name': name,
                                'symbol': symbol,
                                'price': price,
                                'percent_change_24h': percent_change_24h,
                                'logo': logoUrl
                            })
                        })
                        .catch(err => {
                            console.error(err)
                        })  
                    }
                    await redisClient.set('marketcap', JSON.stringify(marketcap), 1800);
                    res.json({marketcap})
                })
                .catch(err => {
                    console.error(err)
                })
            }
        });

module.exports = router;
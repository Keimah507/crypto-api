const express = require('express');
const app = require('../server.js');
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
        }
        res.json({
            trendinglist
        })
    })
});

router.get('/crypto/recents', async(req, res) => {
    await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5&convert=KES&sort=date_added', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        }
    })
    .then(response => response.json())
    .then(async(data) => {
        const recents = [];
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
        res.json({
            recents
        })
    })
    .catch(err => {
        console.error(err)
    })
});

router.get('/crypto/gainers', async(req, res) => {
    await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5&convert=KES&sort=percent_change_24h', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
        }
    })
        .then((response) => response.json())
        .then(async(data ) => {
            const gainers = [];
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
            }
            res.json({gainers})
        })
    });

    router.get('/crypto/market-cap', async(req, res) => {
        await fetch('https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?limit=5&convert=KES&sort=market_cap', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
            }
        })
            .then((response) => response.json())
            .then(async(data) => {
                const marketcap = [];
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
                }
                res.json({marketcap})
            })
        });

module.exports = router;
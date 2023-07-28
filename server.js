const express = require('express');
const cors = require('cors');
const router = require('./routes/index.js');
const connDB = require('./utils/redis.js');

const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With', 'Content-Type');

    next();
})
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(router);



app.listen(process.env.PORT || 8000, () => {
    console.log('app listening on port 8000');
});

module.exports = app;
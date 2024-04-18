const { createClient } = require('redis');
const { promisify } = require('util');

class RedisClient {
    constructor () { 
        this.client = createClient({
            password: 'Keimah001',
            socket: {
                host: 'redis-10259.c15.us-east-1-2.ec2.cloud.redislabs.com:10259',
                port: 10638
            },
            legacyMode: true,
        });
        this.client.connect();
        this.client.on('connect', () => { console.log(`Connected to Redis`) })
        this.client.on('error', (err) => { console.error(err) })
    }

    async get(key) {
        try {
        const getAsync = promisify(this.client.get).bind(this.client);
        return await getAsync(key);
        } catch(err){
            console.error('Error getting value from Redis:', err)
        }
        // this.client.get(key, (err, reply) => {
        //     if(err){
        //         console.error('Error getting value from Redis:', err)
        //         callback(err, null)
        //     } else {
        //         try {
        //             const value = JSON.parse(reply)
        //             callback(null, value)
        //         } catch(err){
        //             console.error('Error parsing JSON from Redis', err)
        //             callback(err, null)
        //         }
        //     }
        // });
    }

    async set(key, value, duration) {
        try{
        const setAsync = promisify(this.client.set).bind(this.client);
        return await setAsync(key, value, 'EX', duration);
        } catch(err) {
            console.error('Error setting value in Redis', err)
        }
    //     const strValue = JSON.stringify(value);
    //     this.client.setEx(key, duration, strValue, (err, reply) => {
    //         if (err) {
    //             console.error('Error setting value in Redis', err)
    //             callback(err);
    //         } else {
    //             callback(null);
    //         }
    //     });
    }
}

const redisClient = new RedisClient();
module.exports = redisClient;
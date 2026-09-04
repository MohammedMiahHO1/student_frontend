const { createClient } = require("redis");

require('dotenv').config();

const redisUrl = process.env.REDIS_URL;
const redisClient = createClient({
    url: redisUrl
});

redisClient.on("error", (err) => {
    console.error("Redis error:", err);
});

async function connectRedis() {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("Connected to Redis");
    }
}

module.exports = {
    redisClient,
    connectRedis
};
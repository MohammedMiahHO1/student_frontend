const {
    redisClient
} = require("../config/redisClient");


async function cacheService(
    cacheKey,
    ttl,
    fetchFunction
) {

    const cachedData =
        await redisClient.get(cacheKey);

    if (cachedData) {

        console.log(`CACHE HIT: ${cacheKey}`);

        return JSON.parse(cachedData);
    }

    console.log(`CACHE MISS: ${cacheKey}`);

    const data =
        await fetchFunction();

    if (!data) {
        return null;
    }

    await redisClient.setEx(
        cacheKey,
        ttl,
        JSON.stringify(data)
    );

    return data;
}


module.exports =
    cacheService;
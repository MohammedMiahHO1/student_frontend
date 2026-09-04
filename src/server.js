

require('dotenv').config();


const app = require('./app'); // Import the app structure
const { connectRedis } = require('../src/config/redisClient');

const PORT = process.env.PORT || 3000;

async function startApp() {
    try {
        await connectRedis(); // Connect to Redis

        app.listen(3000, () => {
            console.log(`🚀 Production server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(" Failed to start application:", error);
        process.exit(1);
    }
}

startApp();

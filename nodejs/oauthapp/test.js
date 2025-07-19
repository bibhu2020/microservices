import { AzureCliCredential } from "@azure/identity";
import { createClient } from 'redis';

const credential = new AzureCliCredential();

async function connectToRedis() {
    const redisScope = "https://redis.azure.com/.default";

    // Get the token
    const tokenResponse = await credential.getToken(redisScope);
    const accessToken = tokenResponse.token;

    const token = await credential.getToken("https://management.azure.com/.default");
    const decodedToken = JSON.parse(Buffer.from(token.token.split('.')[1], 'base64').toString());
    const username= decodedToken.oid;

    // Create a Redis client
    const redisClient = createClient({
        url: `redis://oauthaapi.redis.cache.windows.net:6380`,
        username: username,
        password: accessToken,  // Note: Redis typically does not accept tokens as passwords
        socket: {
            tls: true
        }
    });

    redisClient.on('error', (err) => console.error('Redis Client Error', err));
    
    await redisClient.connect();

    // Example of setting and getting a value
    //await redisClient.set('mykey', 'Hello from Azure!');
    const value = await redisClient.get('mykey');
    console.log(value); // Outputs: Hello from Azure!

    await redisClient.quit();
}

connectToRedis().catch(console.error);

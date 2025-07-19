import { createClient } from 'redis';
import dotenv from 'dotenv';
import { AzureCliCredential, ManagedIdentityCredential } from "@azure/identity";

dotenv.config();

class CacheMiddleware {
  #credential = null;
  #redisClient = null;

  constructor() {
    this.initialized = this.#initializeRedisClient();
  }

  async #getCredential() {
    if (!this.#credential) {
      if (process.env.NODE_ENV === "development") {
        this.#credential = new AzureCliCredential();
      } else {
        this.#credential = new ManagedIdentityCredential(process.env.MANAGED_IDENTITY_CLIENT_ID);
      }
    }
    return this.#credential;
  }

  async #getUserPrincipalId(credential) {
    const token = await credential.getToken("https://management.azure.com/.default");
    const decodedToken = JSON.parse(Buffer.from(token.token.split('.')[1], 'base64').toString());
    return decodedToken.oid;
  }

  async #returnPassword(credential) {
    const redisScope = "https://redis.azure.com/.default";
    const accessToken = await credential.getToken(redisScope);
    return accessToken.token;
  }

  async #initializeRedisClient() {
    try {
      this.#credential = await this.#getCredential();
      const password = await this.#returnPassword(this.#credential);
      const userPrincipalId = await this.#getUserPrincipalId(this.#credential);

      this.#redisClient = createClient({
        username: userPrincipalId,
        password: password,
        url: `redis://${process.env.AZURE_CACHE_FOR_REDIS_HOST_NAME}:6380`,
        pingInterval: 1000,
        socket: { 
          tls: true,
          keepAlive: 0 
        },
      });

      this.#redisClient.on('error', (err) => console.error('Redis Client Error: ', err));
      await this.#redisClient.connect();
    } catch (error) {
      throw new Error("Could not initialize Redis client: " + error.message);
    }
  }

  checkCache = async (req, res, next) => {
    try {
      if (process.env.USE_CACHE != "true") 
        next(); // Skip caching in development

      await this.initialized; // Ensure Redis client is initialized
      const key = req.originalUrl;
      const cachedContent = await this.#redisClient.get(key);
      if (cachedContent) {
        res.send(cachedContent);
      } else {
        res.sendResponse = res.send;
        res.send = async (body) => {
          try {
            await this.#redisClient.set(key, body, 'EX', 300); // Cache for 5 min
          } catch (err) {
            console.error(`Error caching response for key: ${key} - ${err.message}`);
          }
          res.sendResponse(body);
        };
        next();
      }
    } catch (err) {
      console.error("Error in cache middleware: " + err.message);
      next(err);
    }
  };
}

export default CacheMiddleware;
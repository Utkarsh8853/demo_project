import Redis from "ioredis";
import { createClient } from "redis";
import { redisConfig } from "../../envConfig";


console.log(redisConfig.HOST,'/////////////',redisConfig.PORT);
const client = new Redis({
    host: redisConfig.HOST,
    port: redisConfig.PORT,
  }); 
// const client = createClient();
// client.on("error", (err) => console.log("Redis Client Error", err));
// client.connect();

export default client;


class RedisService {
    private client: any;
    constructor() {
        const options = { 
        }
        this.client = createClient(options);
             
    }


    async set(){
        const setInRedis = this.client
    }
}
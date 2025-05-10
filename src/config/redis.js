
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

let redis = null;

export function createRedisClient() {
  if (!redis) {
    redis = new Redis({
      host: process.env.REDIS_HOSTNAME,
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
      username: process.env.REDIS_USERNAME,
    });

    redis.on("connect", () => {
      console.log("Connected to Redis");
    });

    redis.on("error", (err) => {
      console.error("Redis connection error:", err);
    });
  }
  return redis;
}

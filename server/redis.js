const { createClient } = require("redis");

const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

redisClient.on("ready", () => {
  console.log("Connected to Redis server!");
});
redisClient.on("error", (err) => {
  console.log("Error connecting to Redis server: ", err);
});

module.exports = redisClient;

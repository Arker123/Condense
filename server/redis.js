const { createClient } = require("redis");

const redisClient = createClient({
    password: "YfwwNN9ZmK4kuBSbVGLHfhhRz0Y7sQ7r",
    socket: {
        host: "redis-15047.c305.ap-south-1-1.ec2.cloud.redislabs.com",
        port: 15047,
    },
});

redisClient.on("ready", () => {
    console.log("Connected to Redis server!");
});
redisClient.on("error", (err) => {
    console.log("Error connecting to Redis server: ", err);
});

module.exports = redisClient;

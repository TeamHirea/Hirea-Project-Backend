/* eslint-disable no-console */
const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_CLIENT_URL,
});
const redisConn = async () => {
  try {
    client.on("error", (error) => console.log(error));
    await client.connect();

    console.log("You are connected to redis");
  } catch (error) {
    console.log(`Error:${error.message}`);
  }
};

module.exports = { redisConn, client };

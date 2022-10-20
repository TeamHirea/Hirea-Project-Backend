/* eslint-disable no-console */
// const { createClient } = require("redis");

// const client = createClient({
//   url: process.env.REDIS_CLIENT_URL,
// });
// const redisConn = async () => {
//   try {
//     client.on("error", (error) => console.log(error));
//     await client.connect();

//     console.log("You are connected to redis");
//   } catch (error) {
//     console.log(`Error:${error.message}`);
//   }
// };

// module.exports = { redisConn, client };

// ======= redis ver 2 LOCAL

const redis = require("redis");

const redisPassword = "WehVZkYR1KlPPgE95ZpWjGr5SaJVgTkG";
const redisHost = "redis-10958.c89.us-east-1-3.ec2.cloud.redislabs.com";
const redisPort = "10958";

const client = redis
  .createClient
  //     {
  //   url: `redis://default:${redisPassword}@${redisHost}:${redisPort}`,
  // }
  ();

(async () => {
  client.connect();
  client.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("You're connected db redis..");
  });
})();

module.exports = client;

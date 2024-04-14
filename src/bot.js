const {
  ClusterClient,
  getInfo,
  messageType,
} = require("discord-hybrid-sharding");
const process = require("node:process");
const ExtendedClient = require("../src/class/ExtendedClient");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const client = new ExtendedClient();
client.db = new PrismaClient();
client.cluster = new ClusterClient(client);

client.cluster.on("message", (message) => {
  //console.log(message);
  if (message._type !== messageType.CUSTOM_REQUEST) return; // Check if the message needs a reply
  if (message.alive) message.reply({ content: "Yes I am!" });
});
setInterval(() => {
  client.cluster.send({ content: "I am alive as well!" });
}, 5000);

exports = { client };
client.start();

process.on("unhandledRejection", async (reason, promise) => {
  console.log(`Unhandled Rejection at:\n${promise}\nReason:\n${reason}`);
});

process.on("uncaughtException", (err) => {
  console.log(`Uncaught Exception:\n${err}`);
});

process.on("uncaughtExceptionMonitor", (err, origin) => {
  console.log(`Uncaught Exception Monitor:\n${err}\n${origin}`);
});

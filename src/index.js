const {
  ClusterManager,
  HeartbeatManager,
  ReClusterManager,
  messageType,
} = require("discord-hybrid-sharding");
const { WebhookClient, EmbedBuilder } = require("discord.js");
const { log } = require("./functions/logger");
const path = require("path");

require("dotenv").config();

const manager = new ClusterManager(path.join(__dirname, "bot.js"), {
  totalShards: 1, // or 'auto'
  /// Check below for more options
  shardsPerClusters: 1,
  totalClusters: 1,
  mode: "process", // you can also choose "worker"
  token: process.env.DISCORD_BOT_TOKEN,
  // /*restarts: {
  //     max: 5, // Maximum amount of restarts per cluster
  //     interval: 60000 * 60, // Interval to reset restarts
  // },*/
  // //maintenance: true,
});

/*
// Recluster Manager
manager.extend(
    new ReClusterManager()
)
//const optional = {totalShards, totalClusters....}
manager.recluster?.start({restartMode: 'gracefulSwitch', ...optional)
*/

// Heartbeat System
manager.extend(
  new HeartbeatManager({
    interval: 2000, // Interval to send a heartbeat
    maxMissedHeartbeats: 5, // Maximum amount of missed Heartbeats until Cluster will get respawned
  }),
);

manager.on("clusterCreate", (cluster) => {
  cluster.on("message", (message) => {
    //console.log(message);
    if (message._type !== messageType.CUSTOM_REQUEST) return; // Check if the message needs a reply
    message.reply({ content: "hello world" });
  });
  setInterval(() => {
    cluster.send({ content: "I am alive" }); // Send a message to the client
    cluster.request({ content: "Are you alive?", alive: true }); //.then(e => console.log(e)); // Send a message to the client
  }, 5000);

  cluster.on("ready", () => {
    log(`[Cluster ${cluster.id + 1}] Cluster is ready.`, "done");
  });

  cluster.on("death", () => {
    log(`[Cluster ${cluster.id + 1}] Cluster has died.`, "done");
  });
});
manager.spawn({ timeout: -1 });

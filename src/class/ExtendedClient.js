const {
  Client,
  Partials,
  Collection,
  GatewayIntentBits,
} = require("discord.js");
const { getInfo } = require("discord-hybrid-sharding");
const NodeCache = require("node-cache");
const { handle } = require("./handler");

module.exports = class extends Client {
  collection = {
    interactioncommands: new Collection(),
    prefixcommands: new Collection(),
    aliases: new Collection(),
    components: {
      buttons: new Collection(),
      selects: new Collection(),
      modals: new Collection(),
    },
    exampleCache: new NodeCache({
      stdTTL: 60,
      checkperiod: 3,
      deleteOnExpire: true,
    }),
  };
  applicationcommandsArray = [];

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.AutoModerationExecution,
      ],
      partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction,
      ],
      shards: getInfo().SHARD_LIST,
      shardCount: getInfo().TOTAL_SHARDS,
      presence: {
        activities: [
          {
            name: "Status",
            type: 4,
            state: process.env.DISCORD_BOT_ACTIVITY_TEXT
              ? process.env.DISCORD_BOT_ACTIVITY_TEXT.toString()
              : "@ipexa",
          },
        ],
        status: process.env.DISCORD_BOT_STATUS
          ? process.env.DISCORD_BOT_STATUS.toString()
          : "dnd",
      },
    });
  }

  start = async () => {
    await handle(this);
    await this.login(process.env.CLIENT_TOKEN);
  };
};

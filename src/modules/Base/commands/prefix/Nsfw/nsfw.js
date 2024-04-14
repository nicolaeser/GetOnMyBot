const { Message } = require("discord.js");
const client = require("../../../../../bot");

module.exports = {
  structure: {
    name: "nsfw",
    description: "Nsfw Command",
    aliases: ["ns"],
    permissions: "SendMessages",
    cooldown: 5000,
    nsfw: true,
  },
  /**
   * @param {client} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    await message.reply({
      content: "NSFW Command",
    });
  },
};

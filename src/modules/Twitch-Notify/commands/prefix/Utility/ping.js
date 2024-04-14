const {
  Message,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonComponent,
} = require("discord.js");
const client = require("../../../../../bot");

module.exports = {
  structure: {
    name: "ping",
    description: "Replies with Pong!",
    aliases: ["p"],
    // permissions: "Administrator",
    cooldown: 5000,
  },
  /**
   * @param {client} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    const action = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ping:500:320:0004:500")
        .setLabel("Example Button")
        .setStyle(1),
    );
    await message.reply({
      content: "Pong! " + client.ws.ping,
      components: [action],
    });
  },
};

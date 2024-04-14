const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const client = require("../../../../../bot");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  options: {
    cooldown: 5000,
  },
  /**
   * @param {client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.reply({
      content: "Pong! " + client.ws.ping,
    });
  },
};

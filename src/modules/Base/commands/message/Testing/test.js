const {
  MessageContextMenuCommandInteraction,
  ContextMenuCommandBuilder,
} = require("discord.js");
const client = require("../../../../../bot");

module.exports = {
  structure: new ContextMenuCommandBuilder()
    .setName("Test Message command")
    .setType(3),
  /**
   * @param {client} client
   * @param {MessageContextMenuCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.reply({
      content: "Hello message context command!",
    });
  },
};

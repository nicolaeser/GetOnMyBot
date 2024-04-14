const { StringSelectMenuInteraction } = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  customId: "example-select",
  /**
   *
   * @param {client} client
   * @param {StringSelectMenuInteraction} interaction
   */
  run: async (client, interaction) => {
    const value = interaction.values[0];

    await interaction.reply({
      content: `You have selected from the menu: **${value}**`,
      ephemeral: true,
    });
  },
};

const { ButtonInteraction } = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  customId: "onlinecheck",
  /**
   *
   * @param {client} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.reply({
      content: "<a:onlinegif:1006927968406351872> Ja, ich bin online!",
      ephemeral: true,
    });
  },
};

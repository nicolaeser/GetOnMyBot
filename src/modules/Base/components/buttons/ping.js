const { ButtonInteraction } = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  customId: "ping",
  /**
   *
   * @param {client} client
   * @param {ButtonInteraction} interaction
   * @param {Array} args
   */
  run: async (client, interaction, args) => {
    console.log(args);
    await interaction.reply({
      content: `The ping button has been successfully responded! ${args}`,
      ephemeral: true,
    });
  },
};

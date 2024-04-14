const { Interaction } = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  customId: "modal-example",
  /**
   *
   * @param {client} client
   * @param {Interaction} interaction
   */
  run: async (client, interaction) => {
    await interaction.reply({
      content: `Your Name is: **${interaction.fields.getTextInputValue(
        "name",
      )}**`,
      ephemeral: true,
    });
  },
};

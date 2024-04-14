const {
  ButtonInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  customId: "accept-fast-report",
  /**
   *
   * @param {client} client
   * @param {ButtonInteraction} interaction
   * @param {Array} args
   */
  run: async (client, interaction, args) => {
    const user = await client.users.fetch(args[0]);
    await interaction.reply({
      content:
        ":white_check_mark: Fast Report wird als bearbeitet markiert... Der Nutzer sollte eine Info per DM bekommen.",
      ephemeral: true,
    });

    const userembed = new EmbedBuilder()
      .setColor("Green")
      .setTitle("Danke für die Meldung.")
      .setDescription(
        `⚡ Ein gemeldeter Fast-Report wurde **akzeptiert** und somit **bearbeitet**.`,
      )
      .setTimestamp()
      .setFooter({
        iconURL: interaction.guild.iconURL({ size: 4096, forceStatic: false }),
        text: `${interaction.guild.name}`,
      });

    user.send({
      embeds: [userembed],
    });
    await interaction.message.delete();
  },
};

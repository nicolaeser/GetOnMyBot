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
  customId: "deny-fast-report",
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
        ":x: Fast Report wird als abgelehnt markiert... Der Nutzer sollte eine Info per DM bekommen.",
      ephemeral: true,
    });

    const userembed = new EmbedBuilder()
      .setColor("Red")
      .setTitle("Danke für die Meldung.")
      .setDescription(
        `⚡ Ein gemeldeter Fast-Report wurde **abgelehnt** und somit **bearbeitet**.`,
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

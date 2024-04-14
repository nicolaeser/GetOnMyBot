const {
  ButtonInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  customId: "create-fast-report",
  /**
   *
   * @param {client} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    const modal = new ModalBuilder()
      .setTitle("⚡ Fast Report")
      .setCustomId("create-fast-report")
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setLabel("Welche Kategorie hat dein Anliegen?")
            .setCustomId("category")
            .setPlaceholder(
              "Nutzermeldung, Fake Werbung, Fake Gewinnspiel, [...]",
            )
            .setMinLength(3)
            .setMaxLength(20)
            .setStyle(TextInputStyle.Short)
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setLabel("Erkläre uns, was los ist.")
            .setCustomId("problem")
            .setPlaceholder("...")
            .setMinLength(20)
            .setMaxLength(200)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setLabel("Links/Beweise")
            .setCustomId("links")
            .setPlaceholder(
              "https://[....]\nhttps://[....]\nhttps://[....]\nhttps://[....]",
            )
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setLabel("Bestätige, dass du das System nicht ausnutzt!")
            .setCustomId("agreement-abuse")
            .setPlaceholder("Ja")
            .setMinLength(2)
            .setMaxLength(2)
            .setStyle(TextInputStyle.Short)
            .setRequired(true),
        ),
      );

    await interaction.showModal(modal);
  },
};

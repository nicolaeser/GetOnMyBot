const {
  ButtonInteraction,
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  customId: "create-ticket",
  /**
   *
   * @param {client} client
   * @param {ButtonInteraction} interaction
   */
  run: async (client, interaction) => {
    const openTicket = await client.db.Tickets.findFirst({
      where: {
        ownerId: interaction.user.id,
        open: true,
      },
    });
    if (openTicket)
      return await interaction.reply({
        content: `:x: Du hast bereits ein Ticket, welches noch geöffnet ist.`,
        ephemeral: true,
      });

    const modal = new ModalBuilder()
      .setTitle("🎫 Ticket erstellen")
      .setCustomId("create-ticket")
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setLabel("Welche Kategorie hat dein Anliegen?")
            .setCustomId("category")
            .setPlaceholder(
              "........................................................",
            )
            .setMinLength(3)
            .setMaxLength(25)
            .setStyle(TextInputStyle.Short)
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setLabel("Erkläre uns grob was los ist.")
            .setCustomId("problem")
            .setPlaceholder("...")
            .setMinLength(30)
            .setMaxLength(150)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setLabel("Wir bestrafen falsche Tickets, ok?")
            .setCustomId("agreement-abuse")
            .setPlaceholder("Ja")
            .setMinLength(2)
            .setMaxLength(2)
            .setStyle(TextInputStyle.Short)
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setLabel("Wir speichern Logs und Daten vom Ticket, ok?")
            .setCustomId("agreement-privacy")
            .setPlaceholder("Ja")
            .setMinLength(2)
            .setMaxLength(2)
            .setStyle(TextInputStyle.Short)
            .setRequired(true),
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setLabel("Wir werden keine Diskussion führen, ok?")
            .setCustomId("agreement-argument")
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

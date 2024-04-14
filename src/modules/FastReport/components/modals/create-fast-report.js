const {
  Interaction,
  EmbedBuilder,
  ActionRow,
  ActionRowBuilder,
  ButtonBuilder,
} = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  customId: "create-fast-report",
  /**
   *
   * @param {client} client
   * @param {Interaction} interaction
   */
  run: async (client, interaction) => {
    await interaction.reply({
      content: `Danke für deine Meldung. Diese Meldung wird an unser Team weitergegeben und bearbeitet.`,
      ephemeral: true,
    });
    await sendFastReport(client, interaction);
  },
};

async function sendFastReport(client, interaction) {
  const channel = client.channels.cache.get("1217843599602094150");
  const lchannel = client.channels.cache.get("1221195156108345414");
  const embed = new EmbedBuilder()
    .setTitle(`⚡ Neuer Fast Report`)
    .setColor("Yellow")
    .setThumbnail(client.user.avatarURL({ size: 4096, forceStatic: false }))
    .addFields(
      {
        name: `Kategorie:`,
        value: `\`${interaction.fields.getTextInputValue("category")}\``,
      },
      {
        name: "Problem:",
        value: `\`\`\`${interaction.fields.getTextInputValue("problem")}\`\`\``,
      },
      {
        name: "Links/Beweise:",
        value: `\`\`\`${interaction.fields.getTextInputValue("links")}\`\`\``,
      },
    )
    .setFooter({
      text: `⚡ Fast Report von @${interaction.user.tag}`,
      iconURL: interaction.user.avatarURL({ size: 4096, forceStatic: false }),
    })
    .setTimestamp();

  const responseButtons = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("✅ Bearbeitet")
      .setCustomId(`accept-fast-report:${interaction.user.id}`)
      .setStyle(3),
    new ButtonBuilder()
      .setLabel("❌ Ablehnen")
      .setCustomId(`deny-fast-report:${interaction.user.id}`)
      .setStyle(4),
  );

  channel.send({
    content: "<@&996143819319947334>",
    embeds: [embed],
    components: [responseButtons],
  });
  lchannel.send({
    embeds: [embed],
  });
}

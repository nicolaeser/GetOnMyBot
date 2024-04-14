const {
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  PermissionsBitField,
} = require("discord.js");
const client = require("../../../../../bot");

module.exports = {
  structure: {
    name: "createticketembed",
    description: "Create the Ticket Embed",
    aliases: ["cte"],
    permissions: PermissionsBitField.Flags.ManageServer,
    cooldown: 5000,
    nsfw: false,
  },
  /**
   * @param {client} client
   * @param {Message<true>} message
   * @param {string[]} args
   */
  run: async (client, message, args) => {
    if (message.author.id !== "642807365695176724") return;
    const sendticketembed = new EmbedBuilder()
      .setTitle(":tickets: Neues Ticket erstellen")
      .setDescription(
        "Du benötigst Support?\nErstelle ein Ticket, indem du auf:\n:tickets: `Ticket erstellen` drückst.",
      )
      .setThumbnail(client.user.avatarURL({ size: 4096, forceStatic: false }))
      .setColor("Green");
    const buttons = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("create-ticket")
        .setLabel("🎫 Ticket erstellen")
        // .setDisabled(true)
        .setStyle(1),
      new ButtonBuilder()
        .setCustomId("create-fast-report")
        .setLabel("⚡ Fast Report")
        .setStyle(1),
      new ButtonBuilder()
        .setCustomId("onlinecheck")
        .setLabel("Bin ich online?")
        .setEmoji("1006927968406351872")
        .setStyle(3),
    );

    await message.reply({ embeds: [sendticketembed], components: [buttons] });
  },
};

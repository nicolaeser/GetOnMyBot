const { StringSelectMenuInteraction, EmbedBuilder } = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  customId: "ticket-select",
  /**
   *
   * @param {client} client
   * @param {StringSelectMenuInteraction} interaction
   */
  run: async (client, interaction) => {
    const value = interaction.values[0];
    const hasControlRole = interaction.member.roles.cache.has(
      process.env.TICKET_CONTROL_ROLE,
    );

    await interaction.deferReply();

    if (!hasControlRole)
      return interaction.followUp({
        content: `${interaction.user}, Dir fehlt leider die <@&${process.env.TICKET_CONTROL_ROLE}> Rolle um das zu machen!`,
        ephemeral: true,
      });

    switch (value) {
      case "close-ticket":
        await client.db.Tickets.update({
          where: {
            channelId: interaction.channel.id,
          },
          data: {
            open: false,
          },
        });
        await interaction.channel.delete();
        break;
      case "add-twitch-mods":
        await interaction.followUp({
          content: `${interaction.member} hat die Twitch Mods zum Ticket hinzugefügt.`,
        });
        await interaction.channel.permissionOverwrites.edit(
          process.env.ADDITIONAL_ADD_ROLE,
          {
            117760: true,
          },
        );
        break;
      case "status-active":
        const state1embed = new EmbedBuilder()
          .setTitle("<a:onlinegif:1006927968406351872> Ticket Aktiv")
          .setDescription(
            `${interaction.channel} wurde von ${interaction.user} als **Aktiv** markiert.\nDas passiert meistens, sofern das Ticket vom Team als Inaktiv oder Wartend markiert war.`,
          )
          .setThumbnail(
            interaction.guild.iconURL({ forceStatic: false, size: 4096 }),
          )
          .setColor("Green");
        await interaction.followUp({ embeds: [state1embed] });
        break;
      case "status-inactive":
        const state2emed = new EmbedBuilder()
          .setTitle("<a:idlegif:1006927964413362237> Ticket Inaktiv")
          .setDescription(
            `${interaction.channel} wurde von ${interaction.user} als **Inaktiv** markiert.\nDas passiert meistens, wenn der Ticket Ersteller nicht mehr antwortet.`,
          )
          .setThumbnail(
            interaction.guild.iconURL({ forceStatic: false, size: 4096 }),
          )
          .setColor("Yellow");
        await interaction.followUp({ embeds: [state2emed] });
        break;
      case "status-waiting":
        const state3embed = new EmbedBuilder()
          .setTitle("<a:streaminggif:1006927966401470544> Ticket Wartet")
          .setDescription(
            `${interaction.channel} wurde von ${interaction.user} als **wartend** markiert.\nDas passiert meistens, wenn das Team auf Antwort wartet oder wenn auf eine Person mit mehr Erfahrung oder Rechten gewartet wird.`,
          )
          .setThumbnail(
            interaction.guild.iconURL({ forceStatic: false, size: 4096 }),
          )
          .setColor("Purple");
        await interaction.followUp({ embeds: [state3embed] });
        break;
      case "status-awaiting-close":
        const state4embed = new EmbedBuilder()
          .setTitle("<a:dndgif:1006927962668544020> Ticket Schließung geplant")
          .setDescription(
            `${interaction.channel} wurde von ${interaction.user} als auf **Schließung geplant** markiert.\nDas passiert meistens, wenn keine Antwort mehr nach Inaktiv-Status kommt oder sich dein Anliegen erledigt hat.`,
          )
          .setThumbnail(
            interaction.guild.iconURL({ forceStatic: false, size: 4096 }),
          )
          .setColor("Red");
        await interaction.followUp({ embeds: [state4embed] });
        break;
    }
  },
};

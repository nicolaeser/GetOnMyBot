const {
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  customId: "create-ticket",
  /**
   *
   * @param {client} client
   * @param {Interaction} interaction
   */
  run: async (client, interaction) => {
    await interaction.deferReply({ ephemeral: true });

    const openTicket = await client.db.Tickets.findFirst({
      where: {
        ownerId: interaction.user.id,
        open: true,
      },
    });
    if (openTicket)
      return await interaction.followUp({
        content: `:x: Du hast bereits ein Ticket, welches noch geöffnet ist.`,
        ephemeral: true,
      });

    const count = await client.db.Tickets.count();
    const ticketname = `🎫-ticket+${count + 1}`;

    try {
      const ticket = await interaction.guild.channels.create({
        name: ticketname,
        parent: process.env.TICKET_PARENT_ID,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: ["1024"],
          },
          {
            // Ticket Creator
            id: interaction.user.id,
            allow: ["117760"],
          },
          {
            // Developer
            id: process.env.TICKET_DEVELOPER_ROLE,
            allow: ["117760"],
          },
          {
            // Bots
            id: process.env.TICKET_BOT_ROLE,
            allow: ["117760"],
          },
          {
            // Ticket Control Role
            id: process.env.TICKET_CONTROL_ROLE,
            allow: ["117760"],
          },
        ],
      });
      await client.db.Tickets.create({
        data: {
          ownerId: interaction.user.id,
          channelId: ticket.id,
        },
      });
      const embed1 = new EmbedBuilder()
        .setTitle(
          `:white_check_mark: ${interaction.guild.name} Ticket erstellt.`,
        )
        .setDescription(
          `### Das Team probiert nun anhand der gegebenen Informationen dir zu helfen.\n\n### Dennoch können wir **nicht** bei allen Themen helfen.\n - Sollten wir mehr Informationen benötigen, werden wir dir hier schreiben.\n - Solltest du mehr Informationen für uns haben, kannst du uns diese gerne noch hier in das Ticket senden.\n\n`,
        )
        .setThumbnail(
          interaction.guild.iconURL({ forceStatic: false, size: 4096 }),
        );

      const embed2 = new EmbedBuilder()
        .setDescription(
          `### Kategorie\n - \`\`\`${interaction.fields.getTextInputValue("category")}\`\`\`\n### Frage/Problem\n - \`\`\`${interaction.fields.getTextInputValue("problem")}\`\`\`\n### Einwilligung Ausnutzung\n - \`${interaction.fields.getTextInputValue("agreement-abuse")}\`\n### Einwilligung Datenschutz\n - \`${interaction.fields.getTextInputValue("agreement-privacy")}\`\n### Einwillung Diskussionen\n - \`${interaction.fields.getTextInputValue("agreement-argument")}\``,
        )
        .setColor("Random")
        .setFooter({
          text: `© 2018-${new Date().getFullYear()} IPEXA. All rights reserved. Not affiliated with Discord Inc.`,
          iconURL: client.user.avatarURL({ forceStatic: false, size: 4096 }),
        });

      await interaction.followUp({
        content: `:white_check_mark: Dein Ticket wurde erstellt. Öffne es hier: <#${ticket.id}>`,
        ephemeral: true,
      });

      const message = await ticket.send({
        content: `<@&${process.env.TICKET_CONTROL_ROLE}>`,
        embeds: [embed1, embed2],
        components: [
          new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`ticket-select`)
              .setPlaceholder("Verwalte das Ticket")
              .addOptions(
                {
                  emoji: "🚯",
                  label: "Ticket schließen",
                  value: "close-ticket",
                },
                {
                  emoji: "<a:MODS:723217170598985832>",
                  label: "Twitch Mods hinzufügen",
                  value: "add-twitch-mods",
                },
                {
                  emoji: "<a:onlinegif:1006927968406351872>",
                  label: "Aktiv",
                  value: "status-active",
                },
                {
                  emoji: "<a:idlegif:1006927964413362237>",
                  label: "Inaktiv",
                  value: "status-inactive",
                },
                {
                  emoji: "<a:streaminggif:1006927966401470544>",
                  label: "Wartend",
                  value: "status-waiting",
                },
                {
                  emoji: "<a:dndgif:1006927962668544020>",
                  label: "Schließung geplant",
                  value: "status-awaiting-close",
                },
              ),
          ),
          new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
              .setCustomId(`quickanswer`)
              .setDisabled(true)
              .setPlaceholder("Schnellantworten")
              .addOptions({
                emoji: "❓",
                label: "Bald verfügbar.",
                value: "soon",
              }),
          ),
        ],
      });
      await message.pin();
    } catch (e) {
      console.log(e);
      await interaction.followUp({
        content:
          ":x: Ein Fehler ist aufgetreten. Wende dich an ein Teammitglied.",
        ephemeral: true,
      });
    }
  },
};

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require("discord.js");
const client = require("../../../../bot");
const { getLivestream } = require("../../../../functions/twitch");
let streamername = "MontanaBlack88";

module.exports = {
  event: "ready",
  /**
   *
   * @param {client} client
   * @returns
   */
  run: async (client) => {
    // await client.db.LiveStreamStates.update({
    //   data: {
    //     stream_live: false,
    //   },
    //   where: {
    //     streamer_name: streamername,
    //     stream_provider: "Twitch",
    //   },
    // });

    setInterval(async () => {
      // REQUEST THE TWITCH API
      const responsedata = await getLivestream(client, streamername);

      const guild = await client.guilds.cache.get("364466154187653150");
      const channel = await client.channels.cache.get("1027616273712033882");

      const currentstats = await client.db.LiveStreamStates.findUnique({
        where: {
          streamer_name: streamername,
          stream_provider: "Twitch",
        },
      });

      const { embed, components } = await buildedEmbed(
        client,
        responsedata,
        channel,
        currentstats,
      );

      const messages = await channel.messages.fetch({ limit: 5 });
      const hasContent = messages.find(
        (message) => message.content === `https://twitch.tv/${streamername}`,
      );

      if (hasContent) {
        const firstEntryId = hasContent.id;
        const message = await channel.messages.cache.get(firstEntryId);
        await message.edit({
          content: `https://twitch.tv/${streamername}`,
          embeds: [embed],
          components: [components],
        });
      } else {
        channel.send({
          content: `https://twitch.tv/${streamername}`,
          embeds: [embed],
          components: [components],
        });
      }
    }, 30 * 1000);
  },
};

async function buildedEmbed(client, responsedata, channel, currentstats) {
  let embed;
  let components;

  if (!responsedata) {
    if (currentstats.stream_live === true) {
      await client.db.LiveStreamStates.update({
        data: {
          stream_live: false,
        },
        where: {
          streamer_name: streamername,
          stream_provider: "Twitch",
        },
      });
    }

    embed = new EmbedBuilder()
      .setColor("Red")
      .setAuthor({
        url: `https://twitch.tv/${streamername}`,
        name: `${streamername} Ankündigung`,
        iconURL: channel.guild.iconURL({ size: 4096, forceStatic: true }),
      })
      .setDescription(
        `## Offline!\n - Titel: **?**\n - Kategorie: **?**\n - Zuschauer: **0**`,
      )
      .setFooter({ text: "Zuletzt aktualisiert:" })
      .setTimestamp(Date.now());

    components = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setEmoji("🔗")
        .setLabel(`Twitch: ${streamername}`)
        .setURL(`https://twitch.tv/${streamername}`)
        .setStyle("5")
        .setDisabled(false),
      // new ButtonBuilder()
      //   .setEmoji("👀")
      //   .setLabel(`Viewers: 0`)
      //   .setCustomId("viewer")
      //   .setStyle("4")
      //   .setDisabled(true),
    );
  } else if (responsedata) {
    if (currentstats.stream_live === false) {
      await client.db.LiveStreamStates.update({
        data: {
          stream_live: true,
        },
        where: {
          streamer_name: streamername,
          stream_provider: "Twitch",
        },
      });
      channel.send({ content: "<@&925185188978364487>" }).then((message) => {
        setTimeout(() => {
          message.delete();
        }, 5 * 1000);
      });
    }

    const gameimage = `https://static-cdn.jtvnw.net/ttv-boxart/${responsedata.game_id}-188x250.jpg`;
    const thumbnailimage = `${responsedata.thumbnail_url
      .replace("{width}", 1920)
      .replace("{height}", 1080)}?timeid=${Date.now()}`;

    embed = new EmbedBuilder()
      .setAuthor({
        url: `https://twitch.tv/${responsedata.user_name}`,
        name: `${responsedata.user_name} Ankündigung`,
        iconURL: channel.guild.iconURL({ size: 4096, forceStatic: true }),
      })
      .setColor("#5a03fc")
      .setImage(thumbnailimage)
      .setDescription(
        `## ${responsedata.user_name} Streamt!\n - Titel: **${responsedata.title}**\n - Kategorie: **${responsedata.game_name}**\n - Zuschauer: **${responsedata.viewer_count}**`,
      )
      .setFooter({ text: "Live seit:" })
      .setTimestamp(new Date(responsedata.started_at));
    components = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setEmoji("🔗")
        .setLabel(`Twitch: ${streamername}`)
        .setURL(`https://twitch.tv/${streamername}`)
        .setStyle("5")
        .setDisabled(false),
      // new ButtonBuilder()
      //   .setEmoji("👀")
      //   .setLabel(`Viewers: ${responsedata.viewer_count}`)
      //   .setCustomId("viewer")
      //   .setStyle("3")
      //   .setDisabled(true),
    );
  }
  return { embed, components };
}

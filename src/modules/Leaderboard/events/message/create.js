const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, WebhookClient} = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  event: "messageCreate",
  /**
   *
   * @param {client} client
   * @param {Message} message
   * @returns
   */
  run: async (client, message) => {
    if (message.author.bot === true) return;
    const userId = message.author.id;
    if (!userId) return;
    const entry = await client.db.MessageCount.findUnique({where: {userId}});
    if (!entry) {
      return await client.db.MessageCount.create({
        data: {
          userId,
          count: 1
        }
      })
    }

    await client.db.MessageCount.update({
      where: { userId },
      data: {
        count: {
          increment: 1, // increment the count by 1
        },
      },
    });
  }
}

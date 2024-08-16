const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, Message, WebhookClient} = require("discord.js");
const client = require("../../../../bot");

module.exports = {
  event: "messageDelete",
  /**
   *
   * @param {client} client
   * @param {Message} message
   * @returns
   */
  run: async (client, message) => {
    const userId = message.author.id;
    if (!userId) return;
    const entry = await client.db.MessageCount.findUnique({where: {userId}});
    if (!entry || entry.count === 0) return;
    
    await client.db.MessageCount.update({
      where: { userId },
      data: {
        count: {
          decrement: 1, // Decrease the count by 1
        },
      },
    });
  }
}

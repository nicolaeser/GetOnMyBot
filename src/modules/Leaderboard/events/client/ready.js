const { EmbedBuilder, WebhookClient } = require("discord.js");
const cron = require("node-cron");

module.exports = {
  event: "ready",
  /**
   *
   * @param {client} client
   * @returns
   */
  run: async (client) => {
    cron.schedule('10 21 * * *', async () => {
      try {
        const topUsers = await client.db.MessageCount.findMany({
          orderBy: {
            count: 'desc',
          },
          take: 10,
        });

        const leaderboardEntries = await Promise.all(
            topUsers.map(async (entry) => {
              const user = client.users.cache.get(entry.userId);
              if (!user) return null;  // Ensure the user is valid
              return {
                username: user.globalName || user.username,  // Fallback to username if globalName is undefined
                count: entry.count,
              };
            })
        );

        const filteredEntries = leaderboardEntries.filter(entry => entry !== null);  // Filter out any null entries

        const guild = client.guilds.cache.get("364466154187653150");

        const leaderboardEmbed = new EmbedBuilder()
            .setTitle('🏆 Message Count Leaderboard')
            .setColor('#FFD700')
            .setDescription('Top 10 Nutzer mit den meisten Nachrichten in den letzten 24 Stunden.')
            .setThumbnail(guild.iconURL())
            .setTimestamp();

        filteredEntries.forEach((entry, index) => {
          leaderboardEmbed.addFields({
            name: `#${index + 1} @${entry.username}`,
            value: `Messages: ${entry.count}`,
            inline: false,
          });
        });

        const webhook = new WebhookClient({
          url: "https://canary.discord.com/api/webhooks/1057275946215944192/3Ve5wJW3rWIOq6WQQFsoolk6UDwd_qQVqn-p2VVymfSJzvsOAY4Sugf0wXETU5wyAmzx"
        });

        await webhook.send({ embeds: [leaderboardEmbed] });
        await client.db.MessageCount.deleteMany();
        // console.log('Embed sent successfully.');
      } catch (error) {
        console.error('Error sending embed:', error);
      }
    });
  }
};

const { log } = require("../../../../functions/logger");
const client = require("../../../../bot");

const cooldown = new Map();

module.exports = {
  event: "interactionCreate",
  /**
   * @param {client} client
   * @param {import('discord.js').Interaction} interaction
   * @returns
   */
  run: async (client, interaction) => {
    //console.log(interaction);
    if (!interaction.isCommand()) return;

    if (
      process.env.SLASHCOMMANDS !== "activated" &&
      interaction.isChatInputCommand()
    )
      return;
    if (
      process.env.USERCONTEXTCOMMANDS !== "activated" &&
      interaction.isUserContextMenuCommand()
    )
      return;
    if (
      process.env.MESSAGECONTEXTCOMMANDS !== "activated" &&
      interaction.isMessageContextMenuCommand()
    )
      return;

    const command = client.collection.interactioncommands.get(
      interaction.commandName,
    );

    if (!command) return;

    try {
      if (command.options?.developers) {
        if (process.env.OWNER_ID !== interaction.user.id) {
          await interaction.reply({
            content: "You are not authorized to use this command",
            ephemeral: true,
          });

          return;
        } else if (!process.env.OWNER_ID) {
          await interaction.reply({
            content:
              "This is a developer only command, but unable to execute due to missing user IDs in configuration file.",
            ephemeral: true,
          });

          return;
        }
      }

      if (command.options?.nsfw && !interaction.channel.nsfw) {
        await interaction.reply({
          content: "The current channel is not a NSFW channel",
          ephemeral: true,
        });

        return;
      }

      if (command.options?.cooldown) {
        const cooldownFunction = () => {
          let data = cooldown.get(interaction.user.id);

          data.push(interaction.commandName);

          cooldown.set(interaction.user.id, data);

          setTimeout(() => {
            let data = cooldown.get(interaction.user.id);

            data = data.filter((v) => v !== interaction.commandName);

            if (data.length <= 0) {
              cooldown.delete(interaction.user.id);
            } else {
              cooldown.set(interaction.user.id, data);
            }
          }, command.options?.cooldown);
        };

        if (cooldown.has(interaction.user.id)) {
          let data = cooldown.get(interaction.user.id);

          if (data.some((v) => v === interaction.commandName)) {
            await interaction.reply({
              content: "Slow down buddy! You're too fast to use this command",
              ephemeral: true,
            });

            return;
          } else {
            cooldownFunction();
          }
        } else {
          cooldown.set(interaction.user.id, [interaction.commandName]);

          cooldownFunction();
        }
      }

      command.run(client, interaction);
    } catch (error) {
      log(error, "err");
    }
  },
};

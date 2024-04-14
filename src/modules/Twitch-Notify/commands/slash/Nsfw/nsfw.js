const {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} = require("discord.js");
const client = require("../../../../../bot");

module.exports = {
  structure: new SlashCommandBuilder()
    .setName("nsfw")
    .setDescription("Nsfw command."),
  options: {
    nsfw: true,
  },
  /**
   * @param {client} client
   * @param {ChatInputCommandInteraction} interaction
   */
  run: async (client, interaction) => {
    await interaction.reply({ content: "NSFW Command!" });
  },
};

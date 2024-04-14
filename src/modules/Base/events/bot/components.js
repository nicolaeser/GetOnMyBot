const { log } = require("../../../../functions/logger");
const client = require("../../../../bot");

module.exports = {
  event: "interactionCreate",
  /**
   * @param {client} client
   * @param {import('discord.js').Interaction} interaction
   * @returns
   */
  run: (client, interaction) => {
    if (interaction.isButton()) {
      const customIdParts = interaction.customId.split(":");
      const componentName = customIdParts[0];
      const values = customIdParts.slice(1);
      const component = client.collection.components.buttons.get(componentName);

      if (!component) return;

      try {
        component.run(client, interaction, values);
      } catch (error) {
        log(error, "error");
      }

      return;
    }

    if (interaction.isAnySelectMenu()) {
      const customIdParts = interaction.customId.split(":");
      const componentName = customIdParts[0];
      const values = customIdParts.slice(1);
      const component = client.collection.components.selects.get(componentName);

      if (!component) return;

      try {
        component.run(client, interaction, values);
      } catch (error) {
        log(error, "error");
      }

      return;
    }
    if (interaction.isModalSubmit()) {
      const customIdParts = interaction.customId.split(":");
      const componentName = customIdParts[0];
      const values = customIdParts.slice(1);
      const component = client.collection.components.modals.get(componentName);

      if (!component) return;

      try {
        component.run(client, interaction, values);
      } catch (error) {
        log(error, "error");
      }

      return;
    }
  },
};

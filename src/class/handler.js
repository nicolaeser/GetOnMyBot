const { log } = require("../functions/logger");
const fs = require("fs");
const path = require("path");
const { Routes } = require("discord-api-types/v10");
const { REST } = require("@discordjs/rest");
async function handle(client) {
  for (const module of fs.readdirSync(path.join(__dirname, "..", "modules"))) {
    const moduleConfig = require(
      path.join(__dirname, "..", "modules", module, "module.json"),
    );
    try {
      if (moduleConfig.state.load) {
        await loadModule(client, module, moduleConfig);
        log(
          `${moduleConfig.name} is loaded (Author: ${moduleConfig.author} | v${moduleConfig.version}).`,
          "done",
        );
      } else {
        log(
          `${moduleConfig.name} is currently deactivated (Author: ${moduleConfig.author} | v${moduleConfig.version}).`,
          "info",
        );
      }
    } catch (e) {
      log(
        `${moduleConfig.name} isn't loaded! (Author: ${moduleConfig.author} | v${moduleConfig.version}).\n${e}`,
        "err",
      );
    }
  }
  if (process.env.DEPLOY === "activated") {
    await deployCommands(client);
  }
}

async function loadModule(client, module, moduleConfig) {
  if (moduleConfig.state.event) {
    await loadEvents(client, module);
  }
  if (moduleConfig.state.commands) {
    await loadCommands(client, module);
  }
  if (moduleConfig.state.components) {
    await loadComponents(client, module);
  }
}

async function loadEvents(client, module) {
  for (const dir of fs.readdirSync(
    path.join(__dirname, "..", "modules", module, "events"),
  )) {
    for (const file of fs
      .readdirSync(path.join(__dirname, "..", "modules", module, "events", dir))
      .filter((f) => f.endsWith(".js"))) {
      const event = require(
        path.join(__dirname, "..", "modules", module, "events", dir, file),
      );

      if (!event) continue;

      if (!event.event || !event.run) {
        log(
          `Unable to load the event ${dir}/${file} due to missing 'name' or/and 'run' properties.`,
          "warn",
        );

        continue;
      }

      log(`Loaded new event: ${dir}/${file}`, "info");
      if (event.once) {
        client.once(event.event, (...args) => event.run(client, ...args));
      } else {
        client.on(event.event, (...args) => event.run(client, ...args));
      }
    }
  }
}

async function loadCommands(client, module) {
  for (const type of fs.readdirSync(
    path.join(__dirname, "..", "modules", module, "commands"),
  )) {
    for (const dir of fs.readdirSync(
      path.join(__dirname, "..", "modules", module, "commands", type),
    )) {
      for (const file of fs
        .readdirSync(
          path.join(__dirname, "..", "modules", module, "commands", type, dir),
        )
        .filter((f) => f.endsWith(".js"))) {
        const command = require(
          path.join(
            __dirname,
            "..",
            "modules",
            module,
            "commands",
            type,
            dir,
            file,
          ),
        );

        if (!command) continue;

        if (type === "prefix") {
          if (!command.structure?.name || !command.run) {
            log(
              `Unable to load the command ${type}/${file} due to missing 'structure#name' or/and 'run' properties.`,
              "warn",
            );

            continue;
          }

          client.collection.prefixcommands.set(command.structure.name, command);

          if (
            command.structure.aliases &&
            Array.isArray(command.structure.aliases)
          ) {
            command.structure.aliases.forEach((alias) => {
              client.collection.aliases.set(alias, command.structure.name);
            });
          }
        } else {
          if (!command.structure?.name || !command.run) {
            log(
              `Unable to load the command ${type}/${file} due to missing 'structure#name' or/and 'run' properties.`,
              "warn",
            );

            continue;
          }

          client.collection.interactioncommands.set(
            command.structure.name,
            command,
          );
          client.applicationcommandsArray.push(command.structure);
        }

        log(`Loaded new command: ${type}/${file}`, "info");
      }
    }
  }
}

async function loadComponents(client, module) {
  for (const dir of fs.readdirSync(
    path.join(__dirname, "..", "modules", module, "components"),
  )) {
    for (const file of fs
      .readdirSync(
        path.join(__dirname, "..", "modules", module, "components", dir),
      )
      .filter((f) => f.endsWith(".js"))) {
      const component = require(
        path.join(__dirname, "..", "modules", module, "components", dir, file),
      );

      if (!component) continue;

      if (dir === "buttons") {
        if (!component.customId || !component.run) {
          log(
            `Unable to load the component ${dir}/${file} due to missing 'structure#customId' or/and 'run' properties.`,
            "warn",
          );

          continue;
        }

        client.collection.components.buttons.set(component.customId, component);
      } else if (dir === "selects") {
        if (!component.customId || !component.run) {
          log(
            `Unable to load the select menu ${dir}/${file} due to missing 'structure#customId' or/and 'run' properties.`,
            "warn",
          );

          continue;
        }

        client.collection.components.selects.set(component.customId, component);
      } else if (dir === "modals") {
        if (!component.customId || !component.run) {
          log(
            `Unable to load the modal ${dir}/${file} due to missing 'structure#customId' or/and 'run' properties.`,
            "warn",
          );

          continue;
        }

        client.collection.components.modals.set(component.customId, component);
      } else {
        log(`Invalid component type: ${dir}/${file}`, "warn");

        continue;
      }

      log(`Loaded new component: ${dir}/${file}`, "info");
    }
  }
}

async function deployCommands(client) {
  const rest = new REST({ version: "10" }).setToken(
    process.env.DISCORD_BOT_TOKEN,
  );

  try {
    log(
      "Started loading application commands... (this might take minutes!)",
      "info",
    );

    await rest.put(
      process.env.GUILD_ID === null
        ? Routes.applicationGuildCommands(
            process.env.DISCORD_BOT_ID,
            process.env.GUILD_ID,
          )
        : Routes.applicationCommands(process.env.DISCORD_BOT_ID),
      { body: client.applicationcommandsArray },
    );

    log("Successfully loaded application commands to Discord API.", "done");
  } catch (e) {
    log("Unable to load application commands to Discord API.", "err");
  }
}

exports.handle = (client) => handle(client);

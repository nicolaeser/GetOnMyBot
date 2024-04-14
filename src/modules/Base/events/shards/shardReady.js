const client = require("../../../../bot");
const {log} = require('../../../../functions/logger')
const {Snowflake} = require("discord.js")

module.exports = {
    event: "shardReady",
    /**
     *
     * @param {client} client
     * @param {number} shardId
     * @param {Snowflake} unavailableGuilds
     * @returns
     */
    run: async (client, shardId, unavailableGuilds) => {
        log(`[Shard ${shardId}] Ready. Unaivailable Guilds: ${unavailableGuilds}`, "done")
    }
}

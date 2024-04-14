const client = require("../../../../bot");
const {log} = require('../../../../functions/logger')
const {CloseEvent} = require("discord.js")
module.exports = {
    event: "shardDisconnect",
    /**
     *
     * @param {client} client
     * @param {CloseEvent} closeEvent
     * @param {number} shardId
     * @returns
     */
    run: async (client, closeEvent, shardId) => {
        log(`[Shard ${shardId}] Disconnected. ${closeEvent}`, "err")
    }
}

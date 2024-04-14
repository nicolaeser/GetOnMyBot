const client = require("../../../../bot");
const {log} = require('../../../../functions/logger')

module.exports = {
    event: "shardReconnecting",
    /**
     *
     * @param {client} client
     * @param {number} shardId
     * @returns
     */
    run: async (client, shardId) => {
        log(`[Shard ${shardId}] Reconnecting.`, "info")
    }
}

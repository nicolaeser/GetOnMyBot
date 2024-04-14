const client = require("../../../../bot");
const {log} = require('../../../../functions/logger')

module.exports = {
    event: "shardResume",
    /**
     *
     * @param {client} client
     * @param {number} shardId
     * @param {number} replayedEvents
     * @returns
     */
    run: async (client, shardId, replayedEvents) => {
        log(`[Shard ${shardId}] Resumed. ${replayedEvents}`, "info")
    }
}

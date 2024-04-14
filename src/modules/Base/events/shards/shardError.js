const client = require("../../../../bot");
const {log} = require('../../../../functions/logger')

module.exports = {
    event: "shardError",
    /**
     *
     * @param {client} client
     * @param {Error} error
     * @param {number} shardId
     * @returns
     */
    run: async (client, error, shardId) => {
        log(`[Shard ${shardId}] Error. ${error}`, "err")
    }
}

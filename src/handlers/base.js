const pool = require("./database");

const missionCores = {};

class MissionBase {
    id = -1;
    name = 'mission name';

    init(client) {
        console.log(`[mission] ${this.id} ${this.name} init!`);
    }

    async isMissionEnable(serverId) {
        const [result] = await pool.query(
            "SELECT mission FROM mission_servers WHERE serverId = ?",
            [serverId]
        );

        return { data: Object.keys(result)[0] }
    }
}

const registerMission = function (instance) {
    missionCores[instance.id] = instance;
}

exports.MissionBase = MissionBase;
exports.registerMission = registerMission;
exports.missionCores = missionCores;
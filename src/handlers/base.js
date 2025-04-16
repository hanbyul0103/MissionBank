const pool = require("./database");

const missionCores = {};

class MissionBase {
    id = -1;
    name = 'mission name';
    
    init(client) {
        console.log(`[mission] ${this.id} ${this.name} init!`);
    }
    
    async isMissionEnable(serverId) {
        const [ [ { count } ] ] = await pool.query("SELECT COUNT(*) AS count FROM mission_servers WHERE server = ?", [ serverId ]);
        return count > 0;
    }
}

const registerMission = function(instance) {
    missionCores[instance.id] = instance;
}

exports.MissionBase = MissionBase;
exports.registerMission = registerMission;
exports.missionCores = missionCores;
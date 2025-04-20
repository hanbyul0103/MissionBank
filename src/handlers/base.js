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

class WordMission extends MissionBase {
    keyword = 'keyword';
    isInclude = true;

    init(client) {
        super.init(client);
        client.on('messageCreate', this.onMessageCreate);
    }

    onMessageCreate = async (message) => {
        if (message.author.bot) return;

        const content = message.content;
        if (content.includes(this.keyword) === this.isInclude) return;

        const mission = await this.isMissionEnable(message.guildId);
        if (mission.data != this.id) return;

        let use = this.isInclude ? "쓰라고!!!!!!!" : "쓰지 말라고!!!!!!!!";
        message.reply(`${this.keyword} ${use}`);
    }
}

const registerMission = function (instance) {
    missionCores[instance.id] = instance;
}

exports.WordMission = WordMission;
exports.registerMission = registerMission;
exports.missionCores = missionCores;
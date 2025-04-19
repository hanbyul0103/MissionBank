const { MissionBase, registerMission } = require("../handlers/base");

class HEOLBan extends MissionBase {
    constructor() {
        super();
        this.id = 1;
        this.name = "'헐' 없이 대화하기"
    }

    init(client) {
        super.init(client);
        client.on('messageCreate', this.onMessageCreate);
    }

    onMessageCreate = async (message) => {
        if (message.author.bot) return;

        const content = message.content;
        if (!content.includes("헐")) return;

        const mission = await this.isMissionEnable(message.guildId);
        console.log(mission.data !== this.id);
        if (mission.data !== this.id) return;

        message.reply("'헐' 쓰지 말라고!!!!!!");
    }
}

registerMission(new HEOLBan());
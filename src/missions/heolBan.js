const { WordMission, registerMission } = require("../handlers/base");

class HEOLBan extends WordMission {
    constructor() {
        super();
        this.id = 1;
        this.name = "'헐' 없이 대화하기";
        this.keyword = "헐";
        this.isInclude = false;
    }

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

        message.reply("'헐' 쓰지 말라고!!!!!!");
    }
}

registerMission(new HEOLBan());
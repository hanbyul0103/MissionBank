const { MissionBase, registerMission } = require("../handlers/base");

class ZZZBan extends MissionBase {
    constructor() {
        super();
        this.id = 0;
        this.name = "'ㅋㅋㅋ' 없이 대화하기"
    }

    init(client) {
        super.init(client);
        client.on('messageCreate', this.onMessageCreate);
    }

    onMessageCreate = async (message) => {
        if (message.author.bot) return;

        const content = message.content;
        if (!content.includes("ㅋ")) {
            console.log(content.includes("ㅋ"));
            return;
        }


        const mission = await this.isMissionEnable(message.guildId);
        console.log(this.name);
        if (mission.data !== this.id) return;

        message.reply("'ㅋ' 쓰지 말라고!!!!!!");
    }
}

registerMission(new ZZZBan());
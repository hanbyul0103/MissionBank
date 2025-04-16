const { MissionBase, registerMission } = require("../handlers/base");

class ZZZZZZBan extends MissionBase {
    constructor() {
        super();
        this.id = 999999;
        this.name = "'ㅋㅋㅋ' 없이 대화하기"
    }

    init(client) {
        super.init(client);
        client.on('messageCreate', this.onMessageCreate);
    }

    onMessageCreate = async (message) => {
        const content = message.content;
        if (!content.includes("ㅋ")) return;

        const enable = await this.isMissionEnable(message.guildId);
        if (!enable) return;

        // 실패 로직
    }
}

registerMission(new ZZZZZZBan());
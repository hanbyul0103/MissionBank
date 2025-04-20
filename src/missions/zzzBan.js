const { WordMission, registerMission } = require("../handlers/base");

class ZZZBan extends WordMission {
    constructor() {
        super();
        this.id = 0;
        this.name = "'ㅋㅋㅋ' 없이 대화하기";
        this.keyword = "ㅋ";
        this.isInclude = false;
    }
}

registerMission(new ZZZBan());
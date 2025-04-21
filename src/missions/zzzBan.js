const { WordMission, registerMission } = require("../handlers/base");

class ZZZBan extends WordMission {
    constructor() {
        super();
        this.id = 0;
        this.name = "'ㅋ' 없이 대화하기";
        this.keyword = "ㅋ";
        this.isRequired = false;
    }
}

registerMission(new ZZZBan());
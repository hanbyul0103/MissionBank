const { WordMission, registerMission } = require("../handlers/base");

class HEOLBan extends WordMission {
    constructor() {
        super();
        this.id = 1;
        this.name = "'헐' 없이 대화하기";
        this.keyword = "헐";
        this.isRequired = false;
    }
}

registerMission(new HEOLBan());
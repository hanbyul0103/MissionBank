const fs = require("fs");
const path = require("path");

function loadMissions() {
    const missionPath = path.join(__dirname, "../missions");

    fs.readdirSync(missionPath).forEach(file => {
        if (!file.endsWith(".js")) return;
        require(path.join(missionPath, file));
    });

    console.log("[runner] 미션 모듈 로드 완료");
}

module.exports = loadMissions;
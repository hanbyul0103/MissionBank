const cron = require("node-cron");
const jsonController = require("../handlers/jsonController");
const serverDataPath = "./data/serverData.json";
const challengeManager = require("../handlers/challengeManager");
const { missionCores } = require("../handlers/base");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        console.log(`[events] ${client.user.tag} 봇이 온라인 상태가 되었습니다.`);
        console.log(`[events] ${client.guilds.cache.size}개의 서버에서 활동 중`);

        // 봇 상태 메시지 설정
        client.user.setPresence({
            activities: [{ name: "미션", type: 2 }], // type: 0: 플레이 중, 1: 스트리밍 중, 2: 청취 중, 3: 시청 중, 4: 사용 중
            status: "online", // online | idle | dnd | invisible
        });

        // dailyChallenge scheduler
        cron.schedule("44 9 * * *", async () => {
            challengeManager.setMission();
        });

        Object.values(missionCores).forEach(v => v.init(client));
    }
};

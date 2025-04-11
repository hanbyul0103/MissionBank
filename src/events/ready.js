const cron = require("node-cron");
const jsonController = require("../handlers/jsonController");
const serverDataPath = "./data/serverData.json";
const challengeManager = require("../handlers/challengeManager");

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
        cron.schedule("25 10 * * *", async () => {
            const serverData = await jsonController.readData(serverDataPath);
            const serverIds = Object.keys(serverData);

            for (const serverId of serverIds) {
                const channelId = serverData[serverId].channelId;
                const status = serverData[serverId].challengeStatus;
                const guild = await client.guilds.fetch(serverId);

                const channel = await guild.channels.fetch(channelId);

                if (channel) {
                    if (status === "true") {
                        const challenge = await challengeManager.pickChallenge();
                        console.log(`${challenge}`);
                        await channel.send(`🌟 오늘의 미션: **${challenge}**`);
                    }
                    else {
                        await channel.send("asdf");
                    }
                }
            }
        });
    }
};

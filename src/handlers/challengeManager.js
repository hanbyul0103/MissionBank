const jsonController = require("./jsonController");
const challengeDataPath = "./data/challengeData.json";
const serverDataPath = "./data/serverData.json";

async function pickChallenge() {
    const challengeData = await jsonController.readData(challengeDataPath);

    let randomChallenge = Math.floor(Math.random() * challengeData.challenge.length);

    return challengeData.challenge[randomChallenge];
}

async function setMissionStatus(guildId, channelId, status) {
    const serverData = await jsonController.readData(serverDataPath);

    if (!serverData[guildId]) {
        serverData[guildId] = {
            channelId: channelId,
            challengeStatus: status
        };
    }
    else {
        serverData[guildId].channelId = channelId;
        serverData[guildId].challengeStatus = status;
    }

    await jsonController.saveData(serverDataPath, serverData);
}

async function getMissionStatus(guildId) {
    const data = await jsonController.readData(serverDataPath);
    return data[guildId].challengeStatus || "false";
}

module.exports = { pickChallenge, setMissionStatus, getMissionStatus };
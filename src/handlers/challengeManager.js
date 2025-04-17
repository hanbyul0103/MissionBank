const jsonController = require("./jsonController");
const challengeDataPath = "./data/challengeData.json";
const serverDataPath = "./data/serverData.json";
const pool = require("./database");
const { missionCores } = require("../handlers/base");

// 자정에 미션 선택
async function setChallenge(serverId) {
    const randomChallenge = Math.floor(Math.random() * Object.keys(missionCores).length);

    try {
        await pool.query(
            "UPDATE mission_servers SET mission = ? WHERE serverId = ?",
            [missionCores[`${randomChallenge}`].id, serverId]
        );
    } catch (err) {
        console.log("setChallenge failed", err);
    }
}

// 서버 설정
async function setServer(guildId) {
    try {
        await pool.query(
            "INSERT INTO mission_servers (serverId) VALUES (?)",
            [guildId]
        );

        console.log("setServer success");
        return { success: true, message: "성공!" };
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            console.log("setServer failed", err);
            return { success: false, message: "이미 있음" };
        } else {
            console.log("setServer failed", err);
            return { success: false, message: "실패함" };
        }
    }
}

// 미션 설정
async function setMission() {
    try {
        [rows] = await pool.query(
            "SELECT serverId FROM mission_servers"
        );

        await rows.forEach(row => {
            setChallenge(row.serverId);
        });

        console.log("setMission success");
        return { success: true, message: "미션 설정 성공" };
    } catch (err) {
        console.log("setMission failed", err);
        return { success: false, message: "미션 설정 실패" };
    }
}

module.exports = { setChallenge, setServer, setMission };
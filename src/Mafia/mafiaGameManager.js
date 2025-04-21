const { Player } = require("./mafiaRoles");
const { assignRoles } = require("./mafiaRule");

const activeGames = new Map();
let gameCounter = 0;

function startGame(interaction, participants) {
    gameCounter += 1;

    const gameId = gameCounter;
    const playerList = participants.map(user => new Player(user));

    assignRoles(playerList);

    activeGames.set(gameId, { participants: new Set(participants), gameState: "ongoing" });

    for (const player of playerList) {
        player.sendDM(`당신의 역할은 ${player.role.name} 입니다.`);
    }

    return gameId;
}

function isUserInAnyGame(userId) {
    for(let [gameId, gameData] of activeGames) {
        if(gameData.participants.has(userId)) {
            return true;
        }
    }

    return false;
}

function addUserToGame(userId, gameId) {
    if (activeGames.has(gameId)) {
        activeGames.get(gameId).participants.add(userId);
    }
}

function removeUserFromGame(userId, gameId) {
    if (activeGames.has(gameId)) {
        activeGames.get(gameId).participants.delete(userId);
    }
}

function endGame(gameId) {
    if (activeGames.has(gameId)) {
        const gameData = activeGames.get(gameId);
        gameData.gameState = "ended";
        activeGames.delete(gameId);
        // 게임 종료 후 추가 로직 (예: 승리 조건 처리)
        console.log(`게임 ${gameId} 종료`);
    }
}

function cancelGame(gameId) {
    if (activeGames.has(gameId)) {
        activeGames.delete(gameId);
        console.log(`게임 ${gameId} 취소`);
    }
}

function getGameStatus(gameId) {
    return activeGames.has(gameId) ? activeGames.get(gameId).gameState : null;
}

module.exports = {
    startGame,
    isUserInAnyGame,
    addUserToGame,
    removeUserFromGame,
    endGame,
    cancelGame,
    getGameStatus,
};
const userAccountManager = require("../handlers/userAccountManager");

async function givePoint(clientId, amount) {
    const getAccountResult = await userAccountManager.getAccount(clientId);

    if (getAccountResult.success === true) {
        const userData = getAccountResult.data;
        userData.point += amount; // <- 이쪽부분 쿼리로 바꿔야됨 이렇게하면안된다고
    }
    else {
        console.log("givePoint failed", getAccountResult.message);
    }
}

async function deductPoint(clientId, amount) {
    const getAccountResult = await userAccountManager.getAccount(clientId);

    if (getAccountResult.success === true) {
        const userData = getAccountResult.data;
        userData.point = Math.max(0, userData.point - amount);
    }
    else {
        console.log("deductPoint failed", getAccountResult.message);
    }
}

module.exports = { givePoint, deductPoint };
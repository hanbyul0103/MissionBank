const { SlashCommandBuilder } = require("discord.js");
const core = require("../../handlers/Core");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("출석체크")
        .setDescription("매일 3~5p를 받을 수 있습니다."),
    async execute(interaction) {
        const accountId = interaction.user.id;
        const dailyPoint = Math.floor(Math.random() * 3) + 3;

        const getAccountResult = await core.getAccount(accountId);

        if (getAccountResult.success === false) {
            console.log("getAccount failed", getAccountResult.message);
            interaction.reply(getAccountResult.message);
            return;
        }

        const getAttendanceResult = await core.getAttendanceData(accountId);

        if (getAttendanceResult.success === false) {
            console.log("getAttendance failed", getAttendanceResult.message);
            interaction.reply(getAttendanceResult.message);
            return;
        }
        else {
            await core.givePoint(accountId, dailyPoint);
            interaction.reply(getAttendanceResult.message + `\n${dailyPoint}p를 지급받았습니다.`);
        }
    }
};
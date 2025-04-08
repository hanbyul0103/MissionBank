const { SlashCommandBuilder } = require("discord.js");
const challengeManager = require("../../handlers/challengeManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("일일미션")
        .setDescription("매일 새로운 미션이 시작됩니다.")
        .addStringOption(option =>
            option
                .setName("상태")
                .setDescription("옵션을 선택하세요.")
                .setRequired(true)
                .setChoices(
                    { name: "On", value: "true" },
                    { name: "Off", value: "false" }
                )),
    async execute(interaction) {
        const status = interaction.options.getString("상태");
        const guildId = interaction.guild.id;
        const channelId = interaction.channel.id;
        let message;

        status = status === "true";

        await challengeManager.setMissionStatus(guildId, channelId, status);

        message = status ? "미션은 자정(00:00)부터 시작됩니다." : "미션이 종료되었습니다.";

        interaction.reply(message);
    }
};
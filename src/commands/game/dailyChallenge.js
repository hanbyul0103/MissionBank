const { SlashCommandBuilder } = require("discord.js");
const challengeManager = require("../../handlers/challengeManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("일일미션")
        .setDescription("매일 새로운 미션이 시작됩니다."),
    async execute(interaction) {
        const guildId = interaction.guild.id;

        const result = await challengeManager.setServer(guildId);

        interaction.reply("서버 설정 테스트", result.message);
    }
};
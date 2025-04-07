const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("현재 봇의 핑을 확인합니다."),
    async execute(interaction) {
        await interaction.reply(`🏓 Pong! 현재 핑: ${interaction.client.ws.ping}ms`);
    }
};
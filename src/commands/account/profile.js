const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userAccountManager = require("../../handlers/userAccountManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("프로필")
        .setDescription("프로필을 확인할 수 있습니다."),
    async execute(interaction) {
        const accountId = interaction.user.id;
        const getAccountResult = await userAccountManager.getAccount(accountId);

        const profileEmbed = new EmbedBuilder()
            .setAuthor({
                name: `${getAccountResult.data.name}님의 프로필`,
                iconURL: `${interaction.user.displayAvatarURL()}`,
            })
            .addFields(
                {
                    name: "보유한 포인트",
                    value: `${getAccountResult.data.point}p`,
                    inline: true
                },
                {
                    name: "가입 시각",
                    value: `${getAccountResult.data.createAt}`,
                    inline: true
                },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [profileEmbed] });
    }
};
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userAccountManager = require("../../handlers/userAccountManager");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("계정삭제")
        .setDescription("계정을 삭제합니다."),
    async execute(interaction) {
        const accountId = interaction.user.id;

        const accountResult = await userAccountManager.getAccount(accountId);
        let deleteResult;

        if (accountResult.success === true) {
            deleteResult = await userAccountManager.deleteAccount(accountId);
        }
        else {
            console.log("deleteAccount failed", accountResult.message);
        }

        let profileEmbed;

        if (deleteResult.success === true) {
            profileEmbed = new EmbedBuilder()
                .setColor("#B22222")
                .setAuthor({
                    name: "다음에 또 봐요 😢",
                    //iconURL: "missionBankIcon",
                })
                .setTimestamp();
        }
        else {
            profileEmbed = new EmbedBuilder()
                .setAuthor({
                    name: `❌ 계정삭제에 실패했습니다!`,
                    //iconURL: "missionBankIcon",
                })
                .setFooter({
                    text: "현재 시각",
                })
                .setTimestamp();
        }

        await interaction.reply({ embeds: [profileEmbed] });
    }
};
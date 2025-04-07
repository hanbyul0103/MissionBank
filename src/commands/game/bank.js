const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const jsonController = require("../../handlers/jsonController");
const bankDataPath = "./data/bankData.json";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("은행")
        .setDescription("은행에 쌓인 포인트를 확인할 수 있습니다."),
    async execute(interaction) {
        const data = await jsonController.readData(bankDataPath);

        const profileEmbed = new EmbedBuilder()
            .setAuthor({
                name: `은행`,
                //iconURL: "missionBankIcon",
            })
            .addFields(
                {
                    name: "모인 포인트",
                    value: `${data.points}`,
                    inline: true
                },
            )
            .setFooter({
                text: "현재 시각",
            })
            .setTimestamp();

        await interaction.reply({ embeds: [profileEmbed] });
    }
};
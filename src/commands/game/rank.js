const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const core = require("../../handlers/Core");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("랭크")
        .setDescription("상위 5명의 랭크를 확인할 수 있습니다."),
    async execute(interaction) {
        const result = await core.getAllAccount();
        console.log(result.data[0]);

        const rankEmbed = new EmbedBuilder()
            .setColor("#0099FF")
            .setTitle(`랭킹보드`)
            .setFooter(
                {
                    text: "랭킹 업데이트 시간",
                    iconURL: interaction.guild.iconURL()
                })
            .setTimestamp();
            
        for (let i = 0; i < 5; i++) {
            if (!result.data[i]) {
                console.log("for break");
                break;
            }
            rankEmbed.addFields({
                name: `${i + 1}. ${result.data[i].name}`,
                value: `${result.data[i].point}p`,
            });
        }

        await interaction.reply({ embeds: [rankEmbed] });
    }
};
const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const core = require("../../handlers/Core");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("은행")
        .setDescription("은행에 쌓인 포인트를 확인할 수 있습니다."),
    async execute(interaction) {
        const bankResult = await core.getBankData();

        if(bankResult.success === true){
            console.log(bankResult.data.points);
        }
        else {
            console.log("데이터 로드 실패");
        }

        const profileEmbed = new EmbedBuilder()
            .setAuthor({
                name: `은행`,
                //iconURL: "missionBankIcon",
            })
            .addFields(
                {
                    name: "모인 포인트",
                    value: `${bankResult.data.points}`,
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
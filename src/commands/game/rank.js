const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const userAccountManager = require("../../handlers/userAccountManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("랭크")
        .setDescription("상위 5명의 랭크를 확인할 수 있습니다.")
        .addStringOption(option =>
            option
                .setName("범위")
                .setDescription("랭크를 확인할 범위를 선택하세요.")
                .setRequired(true)
                .setChoices(
                    { name: "전체", value: "전체", },
                    { name: "서버", value: "서버", },
                )),
    async execute(interaction) {
        const range = interaction.options.getString("범위");

        const data = await userAccountManager.readAccountData();

        let sortedAccounts = Object.entries(data).sort(([, a], [, b]) => b.points - a.points);

        if (range === "서버") {
            const guildMembers = await interaction.guild.members.fetch();
            const guildMemberIds = guildMembers.map(member => member.id);
            sortedAccounts = sortedAccounts.filter(([userId]) => guildMemberIds.includes(userId));

            if (sortedAccounts.length === 0) {
                return interaction.reply("현재 서버에 등록된 유저가 없습니다.");
            }
        }

        sortedAccounts = Object.fromEntries(sortedAccounts);
        console.log(sortedAccounts[Object.keys(sortedAccounts)[0]].name);

        const rankEmbed = new EmbedBuilder()
            .setColor("#0099FF")
            .setTitle(`${range === "전체" ? "전체" : interaction.guild.name} 랭킹보드`)
            .setFooter(
                {
                    text: "랭킹 업데이트 시간",
                    iconURL: interaction.guild.iconURL()
                })
            .setTimestamp();

        for (let i = 0; i < 5; i++) {
            if (!sortedAccounts[Object.keys(sortedAccounts)[i]]) {
                break;
            }
            rankEmbed.addFields({
                name: `${i + 1}. ${sortedAccounts[Object.keys(sortedAccounts)[i]].name}`,
                value: `${sortedAccounts[Object.keys(sortedAccounts)[i]].points.toLocaleString()}p`,
            });
        }

        await interaction.reply({ embeds: [rankEmbed] });
    }
};
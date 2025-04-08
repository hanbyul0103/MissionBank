const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { DateTime } = require("luxon");
const core = require("../../handlers/Core");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("회원가입")
        .setDescription("게임에 참여할 수 있습니다.")
        .addStringOption(option =>
            option
                .setName("별명")
                .setDescription("게임에 사용할 별명을 입력하세요.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const accountId = interaction.user.id;
        const nickname = interaction.options.getString("별명");
        const accountJoinDate = DateTime.now().setZone("Asia/Seoul").toFormat("yyyy-MM-dd HH:mm:ss");

        const createResult = await core.createAccount(accountId, nickname, accountJoinDate);
        const accountReseult = await core.getAccount(accountId);
        let userData;

        if (accountReseult.success === true)
            userData = accountReseult.data;
        else {
            console.log("accountReseult failed", accountReseult.message);
        }

        let profileEmbed;

        if (createResult.success === true)
            profileEmbed = new EmbedBuilder()
                .setColor("#00FF00")
                .setAuthor({
                    name: `${userData.name}님, 회원가입을 환영합니다!`,
                    iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
                })
                .addFields(
                    {
                        name: "보유한 포인트",
                        value: `${userData.point}p`,
                        inline: true
                    },
                    {
                        name: "가입 시각",
                        value: `${userData.createAt}`,
                        inline: true
                    },
                )
                .setFooter({
                    text: "이제 게임에 참여해보세요!",
                })
                .setTimestamp();
        else {
            profileEmbed = new EmbedBuilder()
                .setColor("#B22222")
                .setAuthor({
                    name: `${userData.name}님, 이미 가입된 계정입니다.`,
                    iconURL: `${interaction.user.displayAvatarURL({ dynamic: true })}`,
                })
                .addFields(
                    {
                        name: "보유한 포인트",
                        value: `${userData.point}p`,
                        inline: true
                    },
                    {
                        name: "가입 시각",
                        value: `${userData.createAt}`,
                        inline: true
                    },
                )
                .setFooter({
                    text: "게임에 참여해보세요!",
                })
                .setTimestamp();
        }

        await interaction.reply({ embeds: [profileEmbed] });
    }
};
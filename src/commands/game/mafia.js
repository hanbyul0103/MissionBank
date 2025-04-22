const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ComponentType, roleMention } = require("discord.js");
const { MafiaGameManager } = require("../../Mafia/mafiaGameManager");
const mafiaSetting = require("../../Mafia/mafiaSetting.json");
const { nanoid } = require("nanoid");

const gameManager = new MafiaGameManager;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("마피아")
        .setDescription("마피아 게임을 시작합니다."),
    async execute(interaction) {
        const roomId = nanoid();
        const room = gameManager.createRoom(roomId);
        gameManager.addPlayerToRoom(interaction, room);

        console.log(`[Mafia] Room-${gameManager.allRooms} was created.\nroomId: ${roomId}`);

        const embed = new EmbedBuilder()
            .setTitle("마피아 게임 참가자 모집")
            .setDescription("아래 버튼을 눌러 마피아 게임에 참가하세요!\n1분 내로 인원이 모이지 않으면 게임이 취소됩니다.")
            .setColor(0x5865F2);

        const joinButton = new ButtonBuilder()
            .setCustomId("join_mafia")
            .setLabel("참가하기")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(joinButton);

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });

        const message = await interaction.fetchReply();

        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60_000, // 1분
        });

        collector.on('collect', async i => {
            const result = gameManager.addPlayerToRoom(i, room);

            if (participants.has(i.user)) {
                return i.reply({ content: '이미 참가하셨습니다!', ephemeral: true });
            }

            if (isUserInAnyGame(i.user.id)) {
                return i.reply({ content: '이미 다른 게임에 참가 중입니다!', ephemeral: true });
            }

            if (participants.size >= mafiaSetting.maxPlayer) {
                return i.reply({ content: '최대 인원에 도달했습니다!', ephemeral: true });
            }

            participants.add(i.user);
            addUserToGame(i.user.id, interaction.guild.id);

            await i.reply({ content: `${i.user.username}님이 참가했습니다!`, ephemeral: true });
        });

        collector.on('end', async () => {
            if (participants.size < mafiaSetting.minPlayer) {
                for (const user of participants) {
                    addUserToGame(user.id, interaction.guild.id);
                }

                await interaction.editReply({
                    content: '❌ 1분 내에 충분한 인원이 모이지 않아 게임이 취소되었습니다.',
                    components: [],
                    embeds: [],
                });

                cancelGame(interaction.guild.id);
                return;
            }

            await interaction.editReply({
                content: `✅ ${participants.size}명 참가 완료! 게임을 시작합니다.`,
                components: [],
                embeds: [],
            });

            const gameId = startGame(interaction, [...participants]);
        });
    }
};

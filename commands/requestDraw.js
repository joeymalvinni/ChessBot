const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const { getGame, gameEnd } = require('../src/games.js');
const { getUser, updateElo, playedGame } = require('../src/user.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('draw')
        .setDescription('Sends draw request to opponent'),
    async execute(client, interaction) {
        try {
            let game = getGame(interaction.user.id);
            let otherPlayerId;
            if (!game) {
                return await interaction.reply({ content: 'You must be in an active game to send a draw request. Try challenging a player using `/challenge`.' });
            } else {
                if (interaction.user.id === game.player1.id) {
                    otherPlayerId = game.player2.id;
                } else if (interaction.user.id === game.player2.id) {
                    otherPlayerId = game.player1.id;
                }
            }

            const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('accept')
					.setLabel('Accept')
					.setStyle(ButtonStyle.Success),
                new ButtonBuilder()
					.setCustomId('decline')
					.setLabel('Decline')
					.setStyle(ButtonStyle.Danger)
			);

            const drawEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Draw Request')
                .setDescription(`<@${interaction.user.id}> sent a draw request to <@${otherPlayerId}>`)
                .setTimestamp();
            await interaction.reply({ embeds: [drawEmbed], components: [row] });

            let answered = false;

            const filter = i => (i.customId === 'accept' || i.customId === 'decline') && i.user.id === otherPlayerId;

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'decline') {
                    i.reply('User declined draw.')
                } else {
                    let newElos = updateElo(interaction.user.id, otherPlayerId, 0.5);
                    playedGame(interaction.user.id, 0.5)
                    playedGame(otherPlayerId, 0.5)
                    gameEnd(`${game.player1.id}-${game.player2.id}`);

                    const drawAcceptedEmbed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('Draw!')
                        .setDescription(`<@${interaction.user.id}> updated elo: ${newElos.player1}\n<@${otherPlayerId}> updated elo: ${newElos.player2}`)
                        .setTimestamp();
                    await interaction.followUp({ embeds: [drawAcceptedEmbed] });
                }
                answered = true;
                collector.stop()
            });

            collector.on('end', async () => {
                collector.stop();
                if (!answered) {
                    await interaction.followUp('User did not respond. Please make sure they are online.')
                }
            })
        } catch (err) {
            console.log("Something Went Wrong => ", err);
        }
    }
};
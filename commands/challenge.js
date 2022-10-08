const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');

const Game = require('../src/game.js');
const { addGame, getGame } = require('../src/games.js');
const { getUser, addUser } = require('../src/user.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('challenge')
        .setDescription('Challenges target player to a game of chess')
        .addUserOption(option => option.setName('user').setDescription('User target')),
    async execute(client, interaction) {
        try {
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

            if (!interaction.options.getUser('user')) {return await interaction.reply({ content: "Please specify the user you would like to challenge.", ephemeral: true })}
            
            if (!getUser(interaction.options.getUser('user'))) {
                addUser(interaction.options.getUser('user'));
            };
            if (!getUser(interaction.user.id)) {
                addUser(interaction.user);
            };

            if (interaction.options.getUser('user').id === interaction.user.id) {
                return await interaction.reply({ content: 'You can\'t challenge yourself.', ephemeral: true });
            }

            const challengeEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle('Challenge!')
                .setDescription(`${interaction.options.getUser('user')} was challenged to a game of chess. You have 15 seconds to accept.`)
                .setTimestamp();
            await interaction.reply({ embeds: [challengeEmbed], components: [row] });

            let answered = false;

            const filter = i => (i.customId === 'accept' || i.customId === 'decline') && i.user.id === interaction.options.getUser('user').id;

            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

            collector.on('collect', async i => {
                if (i.customId === 'decline') {
                    i.reply('User declined challenge.')
                } else {
                    collector.stop();
                    let player1 = getUser(interaction.user.id);
                    let player2 = getUser(interaction.options.getUser('user').id);

                    let newGame = new Game(player1, player2);

                    addGame(interaction.user.id, interaction.options.getUser('user').id, newGame);

                    newGame.draw().then(image => {
                        let boardAttachment = new AttachmentBuilder(image.toBuffer("image/png"), { name: 'chessboard.png' });

                        i.reply({ content: `<@${newGame.turn()}> to move.\n`, files: [boardAttachment] })
                    })
                }
                answered = true;
            });

            collector.on('end', async () => {
                collector.stop();
                if (!answered) {
                    await interaction.followUp({ content: 'User did not respond. Please make sure they are online.', ephemeral: true})
                }
            })
        } catch (err) {
            console.log("Something Went Wrong => ", err);
        }
    }
};
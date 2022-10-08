const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, AttachmentBuilder } = require('discord.js');

const { getGame, gameEnd } = require('../src/games.js');
const { getUser, updateElo, users, playedGame } = require('../src/user.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Makes a move in a game')
        .addStringOption(option =>
            option.setName('move')
                .setDescription('The move you will be making')
                .setRequired(true)),
    async execute(client, interaction) {
        try {
            let game = getGame(interaction.user.id);
            if (!game) {
                const noGameEmbed = new EmbedBuilder()
                    .setColor(0x0099FF)
                    .setTitle('No game')
                    .setDescription('You are not currently in a game of chess. Use the `/challenge` command to challenge a user to a game of chess.')
                    .setTimestamp();
                await interaction.reply({ embeds: [noGameEmbed] });
            } else {
                if (game.turn() === interaction.user.id) {
                    // if it's your turn
                    let m = game.move(interaction.options.getString('move'));
                    
                    if (m) {
                        if (game.isGameOver()) {
                            let otherPlayer;
                            if (game.player1 === interaction.user.id) {
                                otherPlayer = game.player2;
                            } else {
                                otherPlayer = game.player1;
                            }

                            if (game.gameInfo().isCheckmate) {
                                let newElos = updateElo(interaction.user.id, otherPlayer.id, 0);
                    
                                const checkmateEmbed = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`${otherPlayer.username} was checkmated by ${interaction.user.username}.`)
                                    .setDescription(`<@${interaction.user.id}> updated elo: ${newElos.player1}\n<@${otherPlayer.id}> updated elo: ${newElos.player2}`)
                                    .setTimestamp();
                                await interaction.followUp({ embeds: [checkmateEmbed] });
                            } else if (game.gameInfo().isDraw || game.gameInfo().inThreefoldRep || game.gameInfo().inStalemate || game.gameInfo().insufficientMaterial) {
                                let newElos = updateElo(interaction.user.id, otherPlayer.id, 0.5);
                    
                                const drawEmbed = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`${otherPlayer.username} drew with ${interaction.user.username}.`)
                                    .setDescription(`<@${interaction.user.id}> updated elo: ${newElos.player1}\n<@${otherPlayer.id}> updated elo: ${newElos.player2}`)
                                    .setTimestamp();
                                await interaction.followUp({ embeds: [drawEmbed] });
                            }

                            playedGame(otherPlayer.id, 1)
                            playedGame(interaction.user.id, 0)
                            gameEnd(`${game.player1}-${game.player2}`);
                        } else {
                            console.log('drawing board from move', game.isGameOver())
                            // draw board
                            game.draw().then(async image => {
                                let boardAttachment = new AttachmentBuilder(image.toBuffer("image/png"), { name: 'chessboard.png' });
            
                                await interaction.reply({ content: `<@${game.turn()}> to move.\n`, files: [boardAttachment] })
                            })
                        }
                    } else {
                        const invalidMoveEmbed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle('Invalid move')
                            .setDescription(`The move ${interaction.options.getString('move')} is invalid. Please try again.`)
                            .setTimestamp();
                        await interaction.reply({ embeds: [invalidMoveEmbed], ephemeral: true });
                    }
                } else {
                    const notYourTurnEmbed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('It isn\'t your turn.')
                        .setDescription(`You are currently playing ${game.game.turn() === 'w' ? "Black" : "White"}, but it is ${game.game.turn() === 'w' ? "White" : "Black"}'s turn.`)
                        .setTimestamp();
                    await interaction.reply({ embeds: [notYourTurnEmbed], ephemeral: true });
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
};
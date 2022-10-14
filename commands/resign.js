const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const { getGame, gameEnd } = require('../src/games.js');
const { getUser, updateElo, playedGame } = require('../src/user.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resign')
        .setDescription('Resigns the current game'),
    async execute(client, interaction) {
        let game = getGame(interaction.user.id);

        let otherPlayerID;
        if (game.player1.id === interaction.user.id) {
            otherPlayerID = game.player2.id;
        } else {
            otherPlayerID = game.player1.id;
        }

        playedGame(interaction.user.id, 0)
        playedGame(otherPlayerID, 1)
        updateElo(interaction.user.id, otherPlayerID, 0);

        const resignedEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`${interaction.user.username} resigned.`)
            .setDescription(`<@${interaction.user.id}> updated elo: ${getUser(interaction.user.id).elo}\n<@${otherPlayerID}> updated elo: ${getUser(otherPlayerID).elo}`)
            .setTimestamp();
        await interaction.reply({ embeds: [resignedEmbed] });

        gameEnd(`${game.player1}-${game.player2}`);
    }
};
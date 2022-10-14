const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

const { getAllGames } = require('../src/games.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('games')
        .setDescription('Gets all ongoing games'),
    async execute(client, interaction) {
        let formattedGames = '';
        let games = Object.values(getAllGames());

        if (games.length) {
            for (let i = 0; i < games.length; ++i) {
                formattedGames += `${games[i].player1.username} vs ${games[i].player2.username}`;
                formattedGames += '\n';
            }
        } else {
            formattedGames = 'No games are ongoing.'
        }

        await interaction.reply({ content: formattedGames });
    }
};
const { SlashCommandBuilder } = require('@discordjs/builders');

const { leaderboard } = require('../src/user.js');
const table = require('../src/tableBuilder')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Displays user leaderboard'),
    async execute(client, interaction) {
        let leaderboardResults = leaderboard();
        let leaderboardTable = new table([
            { index: 1, label: 'username', width: 20, field: 'username' },
            { index: 2, label: 'elo', width: 10, field: 'elo' },
            { index: 3, label: 'wins', width: 10, field: 'wins' },
            { index: 4, label: 'losses', width: 10, field: 'losses' },
            { index: 5, label: 'games', width: 10, field: 'games' },
            { index: 6, label: 'win rate', width: 10, field: 'winRate' }
        ])

        for (let i = 0; i < leaderboardResults.length; ++i) {
            leaderboardTable.addRow(leaderboardResults[i]);
        }

        await interaction.reply({ content: leaderboardTable.build() });
    }
};
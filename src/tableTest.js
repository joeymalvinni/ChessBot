const table = require('./tableBuilder')

let data = [
    { index: 1, label: 'username', width: 20, field: 'username' },
    { index: 2, label: 'elo', width: 10, field: 'elo' },
    { index: 3, label: 'wins', width: 10, field: 'wins' },
    { index: 4, label: 'losses', width: 10, field: 'losses' },
    { index: 5, label: 'games', width: 10, field: 'games' },
    { index: 6, label: 'win rate', width: 10, field: 'winRate' }
];

let t = new table(data)

// t.addRows([
//     { id: 4, elo: 1316.0031163820117, games: 10, username: 'test4', wins: 5, losses: 5, winRate: '50%' },
//     { id: 5, elo: 1316, games: 5, username: 'test5', wins: 5, losses: 5, winRate: '50%' },
//     { id: 1, elo: 1298.5981711137829, games: 7, username: 'test', wins: 5, losses: 5, winRate: '50%'},
//     { id: 2, elo: 1285.3987125042054, games: 3, username: 'test2', wins: 5, losses: 5, winRate: '50%' },
//     { id: 3, elo: 1284, games: 4, username: 'test3', wins: 5, losses: 5, winRate: '50%' }
// ])

t.addRow({ username: 'test', elo: 1300, wins: 2, losses: 2, games: 1, winRate: '50%' })

console.log(t.build());
const elo = require('./elo.js');

let users = {}

function addUser(user) {
    users[user.id] = {};
    users[user.id].id = user.id;
    users[user.id].elo = 1300;
    users[user.id].games = 0;
    users[user.id].wins = 0;
    users[user.id].losses = 0;
    users[user.id].winRate = '0%';
    users[user.id].username = user.username;
    users[user.id].avatarURL = user.displayAvatarURL({ extension: 'jpg' })

    return users[user.id];
}

function getUser(id) {
    return users[id] || null;
}

// update played count by one
function playedGame(id, won) {
    users[id].games++;
    if (won === 1) {
        users[id].wins++;
    } else if (won === 0) {
        users[id].losses++;
    }

    users[id].winRate = `${Math.round(users[id].wins / users[id].games * 100)}%`;
    return users[id].games;
}

function updateElo(player1, player2, won) {
    // player1 => id
    // player2 => id
    // won => 0, 0.5 or 1, 0 is loss, 0.5 is draw, 1 is win
    let result = elo(users[player1].elo, users[player2].elo, won);

    users[player1].elo = Math.round(result.player1);
    users[player2].elo = Math.round(result.player2);

    return result;
}

function leaderboard () {
    let values = Object.values(users);

    let sorted = values.sort((a, b) => Object.values(b)[1] - Object.values(a)[1]).slice(0, 15);

    return sorted;
}

module.exports = {addUser, getUser, playedGame, updateElo, users, leaderboard}
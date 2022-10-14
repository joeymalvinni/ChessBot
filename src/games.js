let games = {};

function addGame (player1, player2, gameClass) {
    games[`${player1}-${player2}`] = gameClass;
}

// Gets game player is playing
function getGame (player) {
    let keys = Object.keys(games);
    let res = false;

    for (let i = 0; i < keys.length; ++i) {
        if (keys[i].includes(player)) {
            res = games[keys[i]];
            break;
        }
    }

    return res;
}

function gameEnd(id) {
    delete games[id];
    return true;
}

function getAllGames() {
    return games;
}

module.exports = { addGame, getGame, gameEnd, getAllGames };
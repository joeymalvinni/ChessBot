function winChance(player1, player2) {
    return {
        player1: 1 / (1 + 10 ** ((player2 - player1) / 400)),
        player2: 1 / (1 + 10 ** ((player1 - player2) / 400)),
    };
}

function calcElos(player1, player2, won) {
    const chance = winChance(player1, player2);

    won = Math.min(Math.max(won, 0), 1);
    return {
        player1: player1 + 32 * (won - chance.player1),
        player2: player2 + 32 * (1 - won - chance.player2),
    };
}

module.exports = calcElos;
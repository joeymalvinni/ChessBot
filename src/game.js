const Chess = require('chess.js').Chess;
const whiteChessboard = require('./whiteChessboard.js');
const blackChessboard = require('./blackChessboard.js');

class Game {
    constructor (player1, player2) {
        this.game = new Chess();
        
        this.whiteChessboard = new whiteChessboard(50, player2, player1);
        this.blackChessboard = new blackChessboard(50, player1, player2);
        this.player1 = player1;
        this.player2 = player2;
        
        this.white = player1.id;
    }

    flipBoard (board) {
        let final = [];
        for (let i = board.length - 1; i >= 0; --i) {
            final.push(board[i].reverse());
        }
        return final;
    }

    move (position) {
        let move = this.game.move(position);
        this.whiteChessboard.setPosition(this.game.board());
        this.blackChessboard.setPosition(this.flipBoard(this.game.board()));
        return move;
    }

    turn () {
        return this.game.turn() === 'w' ? this.player1.id : this.player2.id;
    }

    gameInfo () {
        return {
            inCheck: this.game.inCheck(),
            inCheckmate: this.game.isCheckmate(),
            inDraw: this.game.isDraw(),
            inStalemate: this.game.isStalemate(),
            inThreefoldRep: this.game.isThreefoldRepetition(),
            insufficientMaterial: this.game.isInsufficientMaterial()
        }
    }

    isGameOver () {
        return (
            this.game.inCheck() ||
            this.game.isCheckmate() ||
            this.game.isDraw() ||
            this.game.isStalemate() ||
            this.game.isThreefoldRepetition() ||
            this.game.isInsufficientMaterial())
    }

    getCaptured(color) {
        const captured = { 'p': 0, 'b': 0, 'n': 0, 'r': 0, 'q': 0 }

        for (const move of this.game.history({ verbose: true })) {
            if (move.hasOwnProperty("captured") && move.color !== color[0]) {
                captured[move.captured]++;
            }
        }

        return captured;
    }

    drawWhite () {
        return this.whiteChessboard.draw(this.getCaptured('white'), this.getCaptured('black'));
    }

    drawBlack () {
        return this.blackChessboard.draw(this.getCaptured('black'), this.getCaptured('white'));
    }

    draw () {
        console.log('drawing board')
        if (this.turn() === this.player1.id) {
            return this.drawWhite();
        } else {
            return this.drawBlack();
        }
    }
}

module.exports = Game;
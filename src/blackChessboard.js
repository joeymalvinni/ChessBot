const { loadImage, createCanvas } = require("canvas");

class blackChessboard {
    width = 400;
    height = 400;

    canvas;
    ctx;

    colors = {
        light: '#f0d9b5',
        dark: '#b58863'
    }

    pieces = {
        'r': 'rook',
        'n': 'knight',
        'b': 'bishop',
        'q': 'queen',
        'k': 'king',
        'p': 'pawn'
    }

    pieceColors = {
        'b': 'black',
        'w': 'white'
    }

    position = [[{"type":"r","color":"b"},{"type":"n","color":"b"},{"type":"b","color":"b"},{"type":"q","color":"b"},{"type":"k","color":"b"},{"type":"b","color":"b"},{"type":"n","color":"b"},{"type":"r","color":"b"}],[{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"},{"type":"p","color":"b"}],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[null,null,null,null,null,null,null,null],[{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"},{"type":"p","color":"w"}],[{"type":"r","color":"w"},{"type":"n","color":"w"},{"type":"b","color":"w"},{"type":"q","color":"w"},{"type":"k","color":"w"},{"type":"b","color":"w"},{"type":"n","color":"w"},{"type":"r","color":"w"}]]
    
    setStyle = 'cburnett';

    squareSize = 50;
    boardOffsetY = 50;
    boardOffsetX = 10;

    player1;
    player2;

    constructor (squareSize, player1, player2) {
        if (!squareSize) this.squareSize = 50;
        else this.squareSize = squareSize;
        this.width = squareSize * 8 + this.boardOffsetX;
        this.height = squareSize * 8 + this.boardOffsetY + 50;

        this.canvas = createCanvas(this.width, this.height);
        this.ctx = this.canvas.getContext('2d');

        this.player1 = player1;
        this.player2 = player2;
    }

    drawBoard () {
        return new Promise ((resolve, reject) => {
            for (let y = 7; y >= 0; --y) {
                for (let x = 7; x >= 0; --x) {
                    this.ctx.fillStyle = ((x + y) % 2 == 0) ? this.colors.light : this.colors.dark;
                    this.ctx.fillRect(x * this.squareSize + this.boardOffsetX, y * this.squareSize + this.boardOffsetY, this.squareSize, this.squareSize);

                    this.ctx.fillStyle = ((x + y) % 2 == 0) ? this.colors.dark : this.colors.light;
                    this.ctx.font = "8px Arial";
                    this.ctx.fillText((y + 1).toString(), 3 + this.boardOffsetX, y * this.squareSize + 8 + this.boardOffsetY);

                    let letter = String.fromCharCode(104 - x);
                    this.ctx.fillStyle = (x % 2 == 1) ? this.colors.dark : this.colors.light;
                    this.ctx.font = "10px Arial";
                    this.ctx.fillText(letter, x * this.squareSize + this.squareSize - 8 + this.boardOffsetX, 8 * this.squareSize - 3 + this.boardOffsetY);
                }
            }

            // this.ctx.strokeStyle = "black";
            // this.ctx.strokeRect(this.boardOffsetX, this.boardOffsetY, this.squareSize * 8, this.squareSize * 8)

            resolve(true);
        })
    }

    drawPieces() {
        return new Promise ((resolve, reject) => {
            for (let y = 0; y < 8; ++y) {
                for (let x = 0; x < 8; ++x) {
                    let curr = this.position[y][x];
        
                    if (curr) {
                        let color = this.pieceColors[curr.color];
                        let type = this.pieces[curr.type];
                        
                        loadImage(`${__dirname}\\pieces\\${this.setStyle}\\${color}_${type}.png`).then(img => {
                            this.ctx.drawImage(img, x * this.squareSize + this.boardOffsetX, y * this.squareSize + this.boardOffsetY);
                        })
                    }
                }
            }

            resolve(this.canvas);
        })
    }

    drawNames() {
        return new Promise (async (resolve, reject) => {
            this.ctx.fillStyle = "white";
            this.ctx.font = '14px sans-serif';
            this.ctx.fillText(`${this.player1.username} (${this.player1.elo})`, this.boardOffsetX + 60, 18);

            this.ctx.fillStyle = "white";
            this.ctx.font = '14px sans-serif';
            this.ctx.fillText(`${this.player2.username} (${this.player2.elo})`, this.boardOffsetX + 60, 478);

            let player1PFP = await loadImage(this.player1.avatarURL);
            this.ctx.drawImage(player1PFP, this.boardOffsetX + 5, 2, 40, 40);

            let player2PFP = await loadImage(this.player2.avatarURL);
            this.ctx.drawImage(player2PFP, this.boardOffsetX + 5, 400 + this.boardOffsetY + 10, 40, 40);

            resolve(this.canvas);
        })
    }

    drawCapturedPieces(allCaptured, color) {
        return new Promise (async (resolve, reject) => {
            // color is either white or black
            let taken = Object.fromEntries(Object.entries(allCaptured).filter(([piece, number]) => number))
            let keys = Object.keys(taken);
            let offset = 0;
            let pieceType;
            
            for (let i = 0; i < keys.length; ++i) {
                if (taken[keys[i]]) {
                    if (pieceType !== keys[i]) {
                        pieceType = keys[i];
                        offset += 9;
                    }
                    
                    for (let j = 0; j < taken[keys[i]]; ++j) {
                        offset += 9;
                        let type = this.pieces[keys[i]];

                        let pieceImage = await loadImage(`${__dirname}\\pieces\\${this.setStyle}\\${color}_${type}.png`);

                        if (color === "black") {
                            this.ctx.drawImage(pieceImage, this.boardOffsetX + 50 + (offset), 23, 20, 20);   
                        } else {
                            this.ctx.drawImage(pieceImage, this.boardOffsetX + 50 + (offset), 480, 20, 20);
                        }
                    }
                }
            }
            resolve(this.canvas);
        })
    }

    draw(caps1, caps2) {
        return new Promise ((resolve, reject) => {
            this.drawBoard().then(x => {
                this.drawCapturedPieces(caps1, 'white').then(y => {
                    this.drawCapturedPieces(caps2, 'black').then(z => {
                        this.drawNames().then(p => {
                            this.drawPieces().then(resolve);
                        })
                    })
                })
            })
        })
    }

    setPosition (pos) {
        this.position = pos;
    }
}

module.exports = blackChessboard;


// Test the chessboard module


// let board = new Chessboard(50);

// const fs = require('fs');

// board.draw({ 'p': 6, 'b': 0, 'n': 2, 'r': 1, 'q': 0 }, { 'p': 3, 'b': 2, 'n': 1, 'r': 0, 'q': 0 }).then(canvas => {
//     const buffer = canvas.toBuffer('image/png');
//     fs.writeFileSync(__dirname + '/chessboard.png', buffer);
//     console.log('success\n');
// });
# ChessBot
A sophisticated Discord chess bot, written with Discord.js and Node.js. 

![chess bot in a game](https://github.com/joeymalvinni/ChessBot/blob/main/images/game.png?raw=true)


## Installation
Clone this repo:
```bash
git clone https://github.com/joeymalvinni/ChessBot.git
cd ChessBot
```

Install necessary node modules with yarn:
```bash
yarn install
```

Create the `.env` file with the fields:
```.env
TOKEN="bot token"
TEST_GUILD_ID="test server id"
```

Run the bot:

```js
npm start
```


## Commands
`/userinfo` - Replies with user information.<br>
`/serverinfo` - Replies with server information.<br>
`/ping` - Ping ChessBot for bot and websocket latency.<br>
`/challenge ${@player}` - Challenge player to game of chess. Person must accept challenge within 15 seconds.<br>
`/games` - Lists current games being played.<br>
`/move` - Make a move in your current game.<br>
`/leaderboard` - Replies with leaderboard table, sorted by ELO.<br>
`/requestDraw` - Sends opponent a draw request for the current game.<br>
`/resign` - Resigns current game.<br>

## Authors

The author of ChessBot is [Joey Malvinni](https://github.com/joeymalvinni)

[List of all contributors](https://github.com/joeymalvinni/ChessBot/graphs/contributors)

## License

  [Apache 2.0](LICENSE)

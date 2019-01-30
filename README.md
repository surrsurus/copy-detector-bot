# copy-detector-bot
A discord bot that detects when an image has been replaced from elsewhere on the internet

## How it works

This bot will detect attachments and send them to google for a reverse image search. If a match is found, it will post a message in the channel to alert users to be wary of the poster's authenticity. This is mainly used to determine if someone is taking credit for art that isn't theirs.

## Requirements & Running

To install the dependencies, run the following:

```
npm install discord.js
npm install request
```

Then, to run the bot:

```
node bot.js
```

## Token file

Make sure there is a token.json file present in the same directory as `bot.js`

The token file should look like:

```json
{
	"token": "Your token here",
}
```
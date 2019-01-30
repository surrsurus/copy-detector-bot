// Load in tokens and other necessities
const token = require('./token.json');

// Filesystem stuff
var path = require('path')
const util = require('util');

// Discord.js provides the suite of tools necessary for interfacing directly
// with the discord application. Without this the bot would be useless.
const Discord = require('discord.js');
const client = new Discord.Client();

// REST API to make GETs
var request = require('request');

// So, when one makes a GET request to google, apparently when you don't have a proper User-Agent,
// it just redirects you to the homepage. This gets around that.
var headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
}

// Log message decorators
const debug  = '[%]';
const record = '[*]';
const fatal  = '[#]';
const warn   = '[!]';
const other  = '[?]';
const none   = '';

// Override log to use our message decorators
console.log = function(msg, type=other) {
  process.stdout.write(util.format(type + ' ' + msg) + '\n');
};

// Ready message
// From the docs:
// The ready event is vital, it means that your bot will only start reacting to information
// from Discord _after_ ready is emitted.
client.on('ready', () => {
  console.log('Logged in & monitoring', debug);
});

// Event listener for messages
client.on('message', message => {

  // Ignore messages from bots. Serves to not create endless loops if responds to self for example.
  if (!message.author.bot) {

    // Only care about messages with attachments
    if (message.attachments.size > 0 ) {

      // Scan each embed, search it, and if it's a replica create a field for it and add it to the embed.
      // While we iterate over *all* possible attachments, discord (at the time of writing this)
      // only accepts one attachment per message

      // By the way, discord.js treats attachments as a map of snowflakes (key) and the actual image object (value),
      // so we just iterate over key/value pairs and only look at the value
      for (var attachment of message.attachments.entries()) {

        // twitter snowflake. not needed, not sure what it could be used for
        // var key = attachment[0];

        var img = attachment[1];

        console.log('Found attachment: ' + img.id), debug;

        // Is the file an image?
        // Pointless to ask google to reverse image search a zip file for instance
        if (['.jpg', '.png', '.gif', '.jpeg', '.bmp'].includes(path.extname(img.filename.toLocaleLowerCase()))) {

          // Make a request to google. Non blocking so other images can be processed
          request({url: 'https://www.google.com/searchbyimage?image_url=' + img.url, method: 'GET', headers: headers}, function (error, response, body) {
            
            // Got something valid back
            if (!error && response.statusCode == 200) {
              
              // The simplest way to detect copies
              if (response.body.includes('Pages that include matching images')) {
                
                // Create an embed to send back
                embed = {
                  color: 0xFF0000,
                  author: {
                    name: client.user.username,
                    icon_url: client.user.avatarURL
                  },
                  title: "STOP RIGHT THERE CRIMINAL SCUM",
                  url: 'https://www.google.com/searchbyimage?image_url=' + img.url,
                  description: "YOU'VE VIOLATED THE LAW FOR THE LAST TIME. PAY THE COURT A FINE OR SERVE YOUR SENTENCE! YOUR STOLEN GOODS ARE NOW FORFEIT.",
                  fields: [
                    {
                      name: img.filename,
                      value: "A reverse image search on google has shown this image to be a replica."
                    }
                  ],
                  timestamp: new Date(),
                  footer: {
                    icon_url: client.user.avatarURL,
                    text: '© bot inc | Note that this may be a false positive. This is not a replacement for human judgement.'
                  }
                };
                message.channel.send({embed: embed});
              } else {
                // If an image is clear, react accordingly
                message.react("👍");
              }
            } else if (error) {
              // Otherwise give an error report.
              embed = {
                color: 0xFF0000,
                author: {
                  name: client.user.username,
                  icon_url: client.user.avatarURL
                },
                title: "An error has occured",
                // url: 'https://www.google.com/searchbyimage?image_url=' + img.url,
                description: "Something went wrong while sending a request to guggle:tm:",
                fields: [
                  {
                    name: img.filename,
                    value: "A reverse image search could not be made for this image"
                  },
                  {
                    name: "Error",
                    value: error
                  }
                ],
                timestamp: new Date(),
                footer: {
                  icon_url: client.user.avatarURL,
                  text: '© bot inc '
                }
              };
              message.channel.send({embed: embed});
            } 
          });

        }

      }
      
    }

  }
});

// Login with token
client.login(token.token);
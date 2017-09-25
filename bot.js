const Discord = require('discord.js');
const bot = new Discord.Client();
const math = require('mathjs');
const mathsteps = require('mathsteps');
const config = require('config.json')('./secrets.json');
const Profane = require('profane');
const censor = new Profane();

const fs = require('fs');
const http = require('http');
const { exec } = require('child_process');

const token = config.token;

var publicIP = {},
  ipChannel

if (fs.exists('publicIP.json', function (exists) {
  if (!exists) {
    fs.writeFileSync('publicIP.json', '{"ip": null}', { flag: 'wx' }, function (err) {
      if (err) throw err;
      console.log('IP json created.');
      publicIP = parsePublicIP();
    });
  } else publicIP = parsePublicIP();
}));


bot.on('ready', () => {
  console.log('0x526561647921');

  const ipServer = bot.guilds.get(config.ipServerID);
  if (typeof ipServer != 'undefined') console.log('Located guild: ' + ipServer.name);
  ipChannel = ipServer.channels.get(config.ipChannelID);
  if (typeof ipChannel != 'undefined') console.log('Located IP channel: ' + ipChannel.name);
});

bot.on('disconnect', event => {
  console.log('!Disconnected: ' + event.reason + ' (' + event.code + ')!');
});

// Public IP checker

let interval = 5 * 60 * 1000;
setInterval(function() {
  console.log('Checking if public IP has changed...');

  var oldIP = publicIP.ip;

  http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function(resp) {
    resp.on('data', function(newIP) {
      if (newIP != oldIP) {
        console.log('IP changed; new IP: ' + newIP);

        console.log('Deleting old IP message...');
        if (publicIP.ip != null) {
          let messageToBeDeletedGuild = bot.guilds.get(publicIP.toPurge.guildID);
          console.log('Marked message guild: ' + messageToBeDeletedGuild.name);

          let messageToBeDeletedChannel = messageToBeDeletedGuild.channels.get(publicIP.toPurge.channelID);
          console.log('Marked message channel: ' + messageToBeDeletedChannel.name);

          let messageToBeDeleted = messageToBeDeletedChannel.messages.get(publicIP.toPurge.messageID);
          console.log('Isolated message to be removed.');

          console.log('Message to be deleted: ' + messageToBeDeleted.content);
          messageToBeDeleted.delete();
          console.log('Old IP message deleted!');
        };

        publicIP.ip = newIP.toString();

        ipChannel.send({embed: {
          author: {
            name: 'Network Monitor',
            icon_url: 'https://maxcdn.icons8.com/Share/icon/Mobile/cellular_network1600.png'
          },
          color: 0xf46242,
          fields: [
            {
              name: 'Server IP:',
              value: '`' + newIP + '`',
              inline: true
            }
          ],
        }
        }).then( msg => {
          publicIP.toPurge = {};
          publicIP.toPurge.messageID = msg.id;
          publicIP.toPurge.channelID = msg.channel.id;
          publicIP.toPurge.guildID = msg.guild.id;
          console.log('Purge details saved.');
          fs.writeFileSync('publicIP.json', JSON.stringify(publicIP), 'utf8');
        });

      } else console.log('It hasn\'t.');
    });
  });

}, interval);



bot.on('message', message => {
  console.log('\n////NEW MESSAGE////');
  console.log('Time: ' + Date());
  console.log('From: ' + message.author.username);
  console.log('Message: ' + message.content);
  console.log('Channel ID: ' + message.channel.id);
  console.log('Channel Name: ' + message.channel.name);
  const messageSplit = message.content.split(' ');

  console.log('Output of censor: ' + JSON.stringify(censor.getCategoryCounts(message.content)));

  for (i = 0; i < messageSplit.length; i++) {
    let simpleWord = messageSplit[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ").toLowerCase().replace(/0|&#1086;/gi,'o').replace(/1/gi,'i');

    console.log('Checking: ' + messageSplit[i]);
    console.log('Simplified: ' + simpleWord);

    console.log(censor.hasWord(simpleWord || simpleWord.replace(/[^\w\s]|(.)(?=\1)/gi, "")));

    if (censor.hasWord(simpleWord || simpleWord.replace(/[^\w\s]|(.)(?=\1)/gi, ""))) {
      console.log('Profanity present in message from: ' + message.author.username);
      message.react('🛑');
      message.reply({'content': '🚫 ¡LANGUAGE CENSORSHIP! 🚫', "embed": {
        "title": "¡LANGUAGE CENSORSHIP!",
        "description": '"' + messageSplit[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").replace(/\s{2,}/g," ") + '" is a bad word. Don\'t use it. >:(',
        "color": 0xff0000,
        "footer": {
          "text": "Glory to LEARAX57H"
        },
        "image": {
          "url": "https://getadblock.com/images/adblock_logo_stripe_test.png"
        }
      }
      }).then(m => {
        delay(100000);
        m.delete();
      });
      break;
    };
  };



  if (message.author.username == 'Guzaboo') {
    message.react('🤔');
  };

  if (!message.author.bot) {

    // Start main processing

    // Calculator abilities
    if (message.content.charAt(0) == '#') {
      console.log('////MATH TIME////');
      var mathInput = message.content.slice(1);
      console.log('Input: ' + mathInput);

      try {

        var mathOutput = math.eval(mathInput);

      } catch (error) {
        console.log('Error Encountered: ' + error);

        try {
          console.log('Trying mathsteps...');
          let steps = mathsteps.simplifyExpression(mathInput);
          steps.forEach(step => {
            var mathOutput = step.newNode;
            console.log('After mathsteps: ' + mathOutput);
          });

        } catch (error) {

          console.log('Error ' + error + ' encountered. Failure.');
          message.reply('Error encountered: ' + mathInput + ' invalid. Error: ' + error);

        };
      };

      if (mathOutput !== undefined) {
        message.delete();
        console.log('Math output valid.');
        message.channel.send(mathInput + ' = ' + mathOutput);
      };

    } else if (message.content.charAt(0) == '?') {	// Commands for all
      switch (messageSplit[0].slice(1)) {
        case 'fortune':
          exec('fortune -s', (err, stdout, stderr) => {	// Executes the fortune command
            if (err) {
              console.log('Error encountered: ' + stderr);
              return;
            };
            message.channel.send(stdout, {'code': true});
            message.delete();
          });
          break;
      }
    } else if (message.author.id == config.admin && message.content.charAt(0) == '$') {         // Commands for the few
      let adminCommand = message.content.slice(1).split(' ');
      console.log('Admin Command Issued: ' + adminCommand);

      switch (adminCommand[0]) {
        case 'sweep':
          switch (adminCommand[1]) {

            case 'content':
              var sweepTargetContent = adminCommand.splice(2).join(' ');
              console.log('Sweeping chat for messages matching ' + sweepTargetContent + '...');
              message.channel.fetchMessages({limit:100}).then(messages => {
                let Victims = messages.filter(message => message.content.includes(sweepTargetContent));

                message.channel.bulkDelete(Victims);
              });
              break;

            case 'charAt':
              console.log('Sweeping chat for messages with a \'' + adminCommand[3] + '\' character in the ' + adminCommand[2] + 'position...')
              message.channel.fetchMessages({limit:100}).then(messages => {
                let Victims = messages.filter(message => message.content.charAt(adminCommand[2]) == adminCommand[3]);

                message.channel.bulkDelete(Victims);
              });
              break;

            case 'author':
              var sweepTargetUser = adminCommand.splice(2).join(' ');
              console.log('Sweeping chat for messages from ' + sweepTargetUser + '...');
              message.channel.fetchMessages({limit:100}).then(messages => {
                let Victims = messages.filter(message => message.author.username == sweepTargetUser);

                message.channel.bulkDelete(Victims);
              });
              break;

            default:
              if (adminCommand[1] != undefined) {
                console.log('Sweeping chat for ' + adminCommand[1] + ' messages...');
              } else {
                console.log('Removing past 100 messages...')
              }
              message.channel.fetchMessages({limit:adminCommand[1]}).then(messages => {
                let Victims = messages;

                message.channel.bulkDelete(Victims);
              });
              break;
          };
      };
      message.delete();
    };
  };
});


function delay(milliseconds) {
  var start = new Date().getTime();
  for (i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    };
  };
}

function parsePublicIP() {
  return JSON.parse(fs.readFileSync('publicIP.json', 'utf8'));
}


bot.login(token);

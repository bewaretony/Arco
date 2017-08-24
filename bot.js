const Discord = require('discord.js');
const bot = new Discord.Client();
const math = require('mathjs');
const mathsteps = require('mathsteps');
const config = require('config.json')('./secrets.json');
const Profane = require('profane');
const censor = new Profane();

const token = config.token;
const { exec } = require('child_process');

bot.on('ready', () => {
  console.log('0x526561647921');
});

bot.on('disconnect', event => {
  console.log('!Disconnected: ' + event.reason + ' (' + event.code + ')!');
});

bot.on('message', message => {
  console.log('\n////NEW MESSAGE////');
  console.log('Time: ' + Date());
  console.log('From: ' + message.author.username);
  console.log('Message: ' + message.content);
  console.log('Channel ID: ' + message.channel.id)
  console.log('Channel Name: ' + message.channel.name)
  const messageSplit = message.content.split(' ');
  console.log('Output of censor: ' + JSON.stringify(censor.getCategoryCounts(message.content)));
  censorLoop:
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
      break censorLoop;
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

bot.login(token);

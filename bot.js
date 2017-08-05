const Discord = require('discord.js');
const bot = new Discord.Client();
const math = require('mathjs');
const mathsteps = require('mathsteps');
const config = require('config.json')('./secrets.json');
const BLF = require('bad-language-filter');
const filter = new BLF();


const token = config.token;


bot.on('ready', () => {
  console.log('0x526561647921');
});

bot.on("disconnect", event => {
  console.log("!Disconnected: " + event.reason + " (" + event.code + ")!");
});

bot.on('message', message => {
  console.log('\n////NEW MESSAGE////');
  console.log('Time: ' + Date());
  console.log('From: ' + message.author.username);
  console.log('Message: ' + message.content);
  console.log('Channel ID: ' + message.channel.id)
  console.log('Channel Name: ' + message.channel.name)
  const messageSplit = message.content.split(' ');

  for (i = 1; i < message.content.length; i++) {
    if (filter.contains(messageSplit[i])) {
      console.log('Profanity "' + messageSplit[i] + '" present in message from: ' + message.author.username);
      message.reply('¡LANGUAGE CENSORSHIP!');
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

      // Admin command handler
    } else if (message.author.id == 245387425164034049 && message.content.charAt(0) == '$') {
      let adminCommand = message.content.slice(1).split(' ');
      console.log('Admin Command Issued: ' + adminCommand);

      switch (adminCommand[0]) {
        case 'sweep':
        switch (adminCommand[1]) {

          case 'content':
          var sweepTargetContent = adminCommand.splice(2).join(' ');
          console.log('Sweeping chat for messages matching ' + sweepTargetContent + '...');
          message.channel.fetchMessages({limit:100}).then(messages => {
            let Victims = messages.filter(message => message.content == sweepTargetContent);

            // If you ain't in line, kill -9
            message.channel.bulkDelete(Victims);
          });
          break;

          case 'charAt':
          console.log('Sweeping chat for messages with a \'' + adminCommand[3] + '\' character in the ' + adminCommand[2] + 'position...')
          message.channel.fetchMessages({limit:100}).then(messages => {
            let Victims = messages.filter(message => message.content.charAt(adminCommand[2]) == adminCommand[3]);

            // If you ain't in line, kill -9
            message.channel.bulkDelete(Victims);
          });
          break;

          default:
          var sweepTargetUser = adminCommand.splice(1).join(' ');
          for (i = 1; i < adminCommand.length; i++) {var sweepTargetUser = sweepTargetUser + ' ' + adminCommand[i]};
          console.log('Sweeping chat for messages from ' + sweepTargetUser + '…');
          message.channel.fetchMessages({limit:100}).then(messages => {
            let Victims = messages.filter(message => message.author.username == sweepTargetUser);

            // If you ain't in line, kill -9
            message.channel.bulkDelete(Victims);
          });
        };
        break;
      };
      message.delete();
    };
  };
});


function delay(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    };
  };
}

bot.login(token);

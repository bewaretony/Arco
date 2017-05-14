const Discord = require('discord.js');
const bot = new Discord.Client();
const SpellChecker = require('spellchecker');
const math = require('mathjs');
const mathsteps = require('mathsteps');

var config = require('config.json')('./secrets.json');
const token = config.token;

const invite = 'https://discord.gg/5RXVSTn'
const botNameList = ['Arco', 'SLAVE_1', 'Minister of Propaganda', 'Tactic']

var marked

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

  if (message.author.username == 'Enforcer') {
    message.react(':childmolester:265679965318676480');
  };

  console.log('Channel ID: ' + message.channel.id)
  console.log('Channel Name: ' + message.channel.name)

  if (message.channel.id == 290582899743260682 && message.author.id !== 245387425164034049) {
    console.log('I am in a land of rioters and lies.')
    var chance = math.randomInt(10)
    console.log('Chance (1 is active): ' + chance)
    if (chance == 1) {
      console.log('Advertisement time!');
      console.log('Invite link: ' + invite)
      var messageID = math.randomInt(5)
      console.log('Message ID: ' + messageID)
      if (messageID == 1) {
        message.reply('FrEe StEaM m0nEy At ThIs LinK !! ClIcK HErE: ' + invite + ' !!');
      };
      if (messageID == 2) {
        message.reply('Click here to recieve a free mac: ' + invite + ' !!');
      };
      if (messageID == 3) {
        message.reply('Did you know: 12% of hagfish species are at risk of extinction. To learn more, visit: ' + invite + ' !!');
      };
      if (messageID == 4) {
        message.reply('\nBITS 16\norg 0x7c00\n\nmov dl, 0\nmov dh, 0\nmov ch, 0\nmov cl, 0x02\nmov bx, 0x1000\nmov es, bx\nmov bx, 0\nmov ah, 0x02\nmov al, 0x01\n\nfile_read:\nint 13h\njc file_read\n\nmov ax, 0x1000\nmov ds, ax\nmov es, ax\nmov fs, ax\nmov gs, ax\nmov ss, ax\njmp 0x1000:0x0\n\ntimes 510-($-$$) db 0\ndw 0xaa55',{code: true, split: true})
        message.reply('Click here to become a programming genius (like me!): ' + invite + ' !!');
      };
      if (messageID == 5) {
        message.reply('This link (' + invite + ') will bring meaning to your life !!');
      };
    };
  };

  if (message.author.username == 'Guzaboo') {
    message.react('🤔');
  };

  if (botNameList.indexOf(message.author.username) == -1 && message.content.charAt(0) + message.content.charAt(1) != '~!') {
    if (message.content.charAt(0) == '#') {
      var mathe = '';
      console.log('////MATH TIME////');

      for(i = 1; i - 1 < message.content.length; i++) {
        var mathe = mathe + message.content.charAt(i);
      };

      console.log('Input: ' + mathe);
      try{
        var answer_normal = math.eval(mathe);

        if (typeof answer_normal !== 'undefined') {
          console.log('Normal valid.');
          message.channel.sendMessage(mathe + '=' + answer_normal);
        };

      } catch(error) {
        console.log('Error Encountered: ' + error);

        try{
          console.log('Trying mathsteps...');
          var steps = mathsteps.simplifyExpression(mathe);
          steps.forEach(step => {
            console.log(step);
            var answer_mathstep = step.newNode;
            console.log('After Change: ' + answer_mathstep);
            console.log(typeof answer_mathstep)

            if (answer_mathstep !== undefined) {
              console.log('Mathstep simplify valid.');
              message.channel.sendMessage(mathe + '=' + answer_mathstep);
            };
          });
        }catch(error) {
          console.log('Error ' + error + ' encountered. Failure.');
          message.channel.sendMessage('Error encountered: ' + mathe + ' invalid. Error: ' + error);
        };
      };
    } else if (message.author.id == 245387425164034049 && message.content.charAt(0) == '$'){
      var adminCommand = '';
      for (i = 1; i < message.content.length; i++) {
        adminCommand = adminCommand + message.content.charAt(i);
      };
      console.log('Admin Command Issued: ' + adminCommand);
      adminCommand = adminCommand.split(' ');
      if (adminCommand[0] == 'sweep') {
        console.log('Sweeping chat for messages from ' + adminCommand[1] + '…');
        message.channel.fetchMessages({limit:100}).then(messages => {
          var Victims = messages.filter(message => message.author.username === marked);
          message.channel.bulkDelete(Victims);
        });
      };
    } else {
      var lex = message.content.split(' ');
      console.log('Words: ' + lex);
      console.log('Number of words: ' + lex.length);
      for(i = 0; i < lex.length; i++) {
        if (SpellChecker.isMisspelled(lex[i])) {
          console.log('Misspelled: ' + lex[i]);
          var corrections = SpellChecker.getCorrectionsForMisspelling(lex[i]);
          console.log(corrections);

          if (typeof(corrections[0]) !== 'undefined') {
            message.channel.sendMessage('*' + corrections[0]);
          };
        };
        console.log('Word checked.');
      };
      console.log('Message checked.');
    };
  };
});

function delay(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

bot.login(token);

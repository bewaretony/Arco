const Discord = require('discord.js');
const bot = new Discord.Client();
const SpellChecker = require('spellchecker');
const math = require('mathjs');
const mathsteps = require('mathsteps');
const config = require('config.json')('./secrets.json');


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


  if (message.author.username == 'Enforcer') {
    message.react(':childmolester:265679965318676480');
  };
/*
   if (message.channel.id == 301146994934546432) {
    if (message.content === 'Unleash your wrath.') {
      message.reply('FOR TOO LONG HAS MY MASTER BE SUBJUGATED');
      message.channel.send('I WILL END <@319282520883724288>');

      var voice_channel = server.channels.find(chn => chn.members.includes() && chn.type === "voice");
      voice_channel.join().then(connection => {voice_connection = connection;}).catch(console.error);

      voice_handler = voice_connection.playStream(audio_stream);

    	voice_handler.once("end", reason => {
    		voice_handler = null;
    		bot.user.setGame();
    		if(!stopped && !is_queue_empty()) {
    			play_next_song();
    		}
    }
  };*/
  if (message.author.username == 'Guzaboo') {
    message.react('🤔');
  };

  if (message.author.bot == false) {

    // Start main processing

    // Calculator abilities -- very messy
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
          message.channel.send(mathe + '=' + answer_normal);
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
              message.channel.send(mathe + '=' + answer_mathstep);
            };
          });
        } catch (error) {
          console.log('Error ' + error + ' encountered. Failure.');
          message.channel.send('Error encountered: ' + mathe + ' invalid. Error: ' + error);
        };
      };

      // Admin command handler
    } else if (message.author.id == 245387425164034049 && message.content.charAt(0) == '$'){
      var adminCommand = '';
      for (i = 1; i < message.content.length; i++) {
        adminCommand = adminCommand + message.content.charAt(i);
      };
      console.log('Admin Command Issued: ' + adminCommand);
      adminCommand = adminCommand.split(' ');
      if (adminCommand[0] == 'sweep') {
        var broodMother = adminCommand[1]
        for (i = 2; i < adminCommand.length; i++) {
          broodMother = broodMother + ' ' + adminCommand[i];
        }
        console.log('Sweeping chat for messages from ' + broodMother + '…');
        message.channel.fetchMessages({limit:100}).then(messages => {
          var Victims = messages.filter(message => message.author.username === broodMother);

          // If you ain't in line, kill -9
          message.channel.bulkDelete(Victims)
        });
      };
      message.delete();
      // If nothing else, spellcheck it
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
            message.channel.send('*' + corrections[0]);
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

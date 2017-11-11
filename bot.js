const Discord = require('discord.js'),
  client = new Discord.Client(),
  math = require('mathjs'),
  parser = math.parser(),
  Profane = require('profane'),
  censor = new Profane(),
  fs = require('fs'),
  http = require('http'),
  exec = require('child_process').exec

math.import({
  'import':     function () { throw new Error('Import is disabled') },
  'createUnit': function () { throw new Error('CreateUnit is disabled') },
  'eval':       function () { throw new Error('Eval is disabled') },
  'parse':      function () { throw new Error('Parse is disabled') },
  'simplify':   function () { throw new Error('Simplify is disabled') },
  'derivative': function () { throw new Error('Derivative is disabled') }
}, { override: true })

const config = JSON.parse(fs.readFileSync('secrets.json'))

let publicIP = {},
  ipServer,
  ipChannel

fs.exists('publicIP.json', function (exists) {
  if (!exists) {
    fs.writeFileSync('publicIP.json', JSON.stringify({ 'ip': null }), { flag: 'w' }, function (err) {
      if (err) throw err
      console.log('IP json created.')
    })
  }
})


client.on('ready', () => {
  console.log('0x526561647921')

  console.log(config.ipServerID)
  ipServer = client.guilds.get(config.ipServerID)
  console.log('Located guild: ' + ipServer.name)
  ipChannel = ipServer.channels.get(config.ipChannelID)
  console.log('Located IP channel: ' + ipChannel.name)

  checkIPChange(publicIP)
})

client.on('disconnect', event => {
  console.log('!Disconnected: ' + event.reason + ' (' + event.code + ')!')
})


// Public IP checker
let interval = 5 * 60 * 1000
setInterval(checkIPChange, interval, publicIP)



client.on('message', message => {
  console.log('\n' + Date() + ' | ' + message.author.username + ': ' + message.content)
  console.log('Channel ID: ' + message.channel.id)
  console.log('Channel Name: ' + message.channel.name)
  const messageSplit = message.content.split(' ')

  let date = new Date()
  console.log('Hours: ' + date.getHours())
  if (date.getHours() >= 22 || date.getHours() < 6) {
    message.react('🅱')
      .then(() => message.react('🇪')
        .then(() => message.react('🇩')
          .then(() => message.react('🛏')
          )
        )
      )
  }


  console.log('Output of censor: ' + JSON.stringify(censor.getCategoryCounts(message.content)))

  for (let i = 0; i < messageSplit.length; i++) {
    let simpleWord = messageSplit[i].replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,'').replace(/\s{2,}/g,' ').toLowerCase().replace(/0|&#1086;/gi,'o').replace(/1/gi,'i').replace(' ', '')

    console.log('Checking: ' + messageSplit[i])
    console.log('Simplified: ' + simpleWord)

    console.log(censor.hasWord(simpleWord || simpleWord.replace(/[^\w\s]|(.)(?=\1)/gi, '')))

    if (censor.hasWord(simpleWord || simpleWord.replace(/[^\w\s]|(.)(?=\1)/gi, ''))) {
      console.log('Profanity present in message from: ' + message.author.username)
      message.react('🛑')
      message.reply({'content': '🚫 ¡LANGUAGE CENSORSHIP! 🚫', 'embed': {
        'title': '¡LANGUAGE CENSORSHIP!',
        'description': '"' + messageSplit[i].replace(/[.,/#!$%^&*;:{}=\-_`~()]/g,'').replace(/\s{2,}/g,' ') + '" is a bad word. Don\'t use it. >:(',
        'color': 0xff0000,
        'footer': {
          'text': 'Glory to LEARAX57H'
        },
        'image': {
          'url': 'https://getadblock.com/images/adblock_logo_stripe_test.png'
        }
      }
      }).then(m => {
        delay(100000)
        m.delete()
      })
      break
    }
  }



  if (message.author.username == 'Guzaboo') {
    if (message.content.charAt(message.content.length - 1) === '?') {
      message.react('🤔')
    } else message.react('🙅')
  }

  if (!message.author.bot) {

    // Start main processing

    // Calculator abilities
    if (message.content.charAt(0) == '#') {
      console.log('////MATH TIME////')
      let mathInput = message.content.slice(1)
      console.log('Input: ' + mathInput)

      message.delete()

      try {
        message.channel.send(mathInput + ' returns ' + parser.eval(mathInput))
      } catch (err) {
        message.channel.send(mathInput + ' returns ' + err)
      }


    } else if (message.content.charAt(0) == '?') {							// Commands for all
      switch (messageSplit[0].slice(1)) {
        case 'fortune':
          exec('fortune -s ' + message.content.slice(messageSplit[0].length + 1), (err, stdout) => {	// Executes the fortune command
            if (err) {
              console.log('Error encountered: ' + err)
              return
            }

            message.channel.send(stdout, {'code': true})
            message.delete()
          })
          break
      }
    } else if (message.author.id == config.admin && message.content.charAt(0) == '$') {			// Commands for the few
      let adminCommand = message.content.slice(1).split(' ')
      console.log('Admin Command Issued: ' + adminCommand)

      switch (adminCommand[0]) {
        case 'sweep':
          switch (adminCommand[1]) {

            case 'content':
              message.channel.fetchMessages({limit:100}).then(messages => {
                let sweepTargetContent = adminCommand.splice(2).join(' ')
                console.log('Sweeping chat for messages matching ' + sweepTargetContent + '...')

                let Victims = messages.filter(message => message.content.includes(sweepTargetContent))

                message.channel.bulkDelete(Victims)
              })
              break

            case 'charAt':
              console.log('Sweeping chat for messages with a \'' + adminCommand[3] + '\' character in the ' + adminCommand[2] + 'position...')
              message.channel.fetchMessages({limit:100}).then(messages => {
                let Victims = messages.filter(message => message.content.charAt(adminCommand[2]) == adminCommand[3])

                message.channel.bulkDelete(Victims)
              })
              break

            case 'author':
              message.channel.fetchMessages({limit:100}).then(messages => {
                let sweepTargetUser = adminCommand.splice(2).join(' ')
                console.log('Sweeping chat for messages from ' + sweepTargetUser + '...')

                let Victims = messages.filter(message => message.author.username == sweepTargetUser)

                message.channel.bulkDelete(Victims)
              })
              break

            default:
              if (adminCommand[1] != undefined) {
                console.log('Sweeping chat for ' + adminCommand[1] + ' messages...')
              } else {
                console.log('Removing past 100 messages...')
              }
              message.channel.fetchMessages({limit:adminCommand[1]}).then(messages => {
                let Victims = messages

                message.channel.bulkDelete(Victims)
              })
              break
          }
      }
      message.delete()
    }
  }
})


function delay(milliseconds) {
  let start = new Date().getTime()

  for (let i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break
    }
  }
}

/*
 * function randInt(min, max) {
 *   min = Math.ceil(min)
 *   max = Math.floor(max)
 *   return Math.floor(Math.random() * (max - min + 1)) + min
 * }
 */

function parsePublicIP() {
  return JSON.parse(fs.readFileSync('publicIP.json', 'utf8'))
}

function checkIPChange(publicIP) {
  console.log('Checking if public IP has changed...')

  publicIP = parsePublicIP()

  let oldIP = publicIP.ip

  http.get({'host': 'api.ipify.org', 'port': 80, 'path': '/'}, function (resp) {
    resp.on('data', function (newIP) {
      if (newIP != oldIP) {
        console.log('IP changed; new IP: ' + newIP)

        if (publicIP.ip != undefined) {
          console.log('Deleting old IP message...')

          ipChannel.fetchMessage(publicIP.toPurgeID).then( msg => {

            console.log('Isolated message to be removed.')

            console.log('Message to be deleted: ' + msg.content)
            msg.delete()
            console.log('Old IP message deleted!')
          })
        }

        publicIP.ip = newIP.toString()

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
          msg.pin()

          publicIP.toPurgeID = msg.id
          console.log('Purge details saved.')
          fs.writeFileSync('publicIP.json', JSON.stringify(publicIP), 'utf8')
        })

      } else console.log('It hasn\'t.')
    })
  }).on('error', function (err) {
    console.log('Failure to connect: ' + err)
  })
}

client.login(config.token)

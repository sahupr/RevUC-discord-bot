const Discord = require('discord.js')
const emailValidator = require('email-validator')

const token = require("./token")
const random = require('random');

const help = require("./help")
const multiply = require("./multiply")
const react = require("./react")
const countdown = require("./countdown")
const checkin = require('./checkin')

const client = new Discord.Client()

var stats = {}

client.once('ready', () => {
    console.log('the bot is online!')
    client.user.setActivity('with Javascript', {type: "PLAYING"})

    //list all servers the bot is connected to
    console.log('\nServers:')
    client.guilds.cache.forEach((guild) => {
        console.log(' - '+guild.name)

        //list all channels in the server
        guild.channels.cache.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
    })


//     //send a message to a specific channel
//     var generalChannel = client.channels.cache.get('750373912738791567')
//     generalChannel.send('hello world')    
    
// })

// client.on('message', (receivedMessage) => {
//     //prevent bot from responding to its own message
//     if(receivedMessage.author == client.user) {
//         return
//     }

//     //bot responds to all messages in ALL channels in the server
//     receivedMessage.channel.send("Message received from " + receivedMessage.author.toString() + ": " + receivedMessage.content)

//     //bot responds to all messages in ALL channels it has been tagged in
//     if(receivedMessage.content.includes(client.user.toString())) {
//         receivedMessage.channel.send("Message received from " + receivedMessage.author.toString() + ": " + receivedMessage.content)
//     }

})

const ParticipationCodes = ['REVUC2021OC', 'NICETOMEETYALL', 'HACKINGINTENSIFIES', 'W1SOFUN', 'SUPERCOOLW2', 'YOUMEANDW3', 'W4RULES', 'SPIDERWEBS', 'SIOTPLAYER', 'CHITCHATSH', 'FRIENDLYTREES', 'GOTOSLEEP', 'QOTHISLIT', 'NOMORESITTING', 'UNTILNEXTYEAR']

client.on('message', async (receivedMessage) => {
    if(receivedMessage.author == client.user) {
        return
    }

    if(receivedMessage.channel.name === process.env.CHECK_IN_CHANNEL_NAME) {
        // if receivedMessage is an email
        if(emailValidator.validate(receivedMessage)) {
            // run the checkIn function
            await checkin(receivedMessage)
        }
    } 

    if (receivedMessage.guild.id in stats === false) {
        stats[receivedMessage.guild.id] = {};
    }

    const guildStats = stats[receivedMessage.guild.id]
    if (receivedMessage.author.id in guildStats === false){
        guildStats[receivedMessage.author.id] = {
            xp: 0,
            level: 0,
            lastMessage: 0
        }
    }
    const userStats = guildStats[receivedMessage.author.id]
    ParticipationCodes.forEach((code) => {
        if (receivedMessage.content == code) {
            console.log(code)
            userStats.xp += random.int(15,25)
        }
    })

    console.log(receivedMessage.author.username + ' now has ' + userStats.xp)

    if(receivedMessage.content.startsWith('!')) {
        processCommand(receivedMessage)
    }
})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)     //remove the leading/bot identifying character
    let splitCommand = fullCommand.split(" ")               //split the message up into pieces for each space
    let primaryCommand = splitCommand[0]                    //take the first string from the split
    let arguments = splitCommand.slice(1)                   //all other words are arguments/parameters for the primaryCommand

    console.log('command received: ' + primaryCommand)
    console.log('Arguments: ' + arguments)

    switch(primaryCommand) {
        case 'help':
            help(arguments, receivedMessage)
            break
        case 'multiply':
            multiply(arguments, receivedMessage)
            break
        case 'react':
            react(arguments, receivedMessage)
            break
        case 'countdown':
            countdown(arguments, receivedMessage)
            break
        case 'checkin':
            checkin(arguments, receivedMessage)
            break
    }
    
}

client.login(token)
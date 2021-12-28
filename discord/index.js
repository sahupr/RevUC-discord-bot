const Discord = require('discord.js')

const client = require('./client')
const help = require("./help")
const multiply = require("./multiply")
const react = require("./react")
const countdown = require("./countdown")
const checkin = require('./checkin')
const { score, top } = require('./score')
const revvit = require("./revvit")
const background = require("./background")
const checkin_prv = require("./checkin_prv")

const CHECKIN_CHANNEL_ID = process.env.CHECKIN_CHANNEL_ID

client.once('ready', () => {
    console.log('the bot is online!')
    client.user.setPresence({
        status: 'online',
        activity: {
            name: `NodeJS and Postgres`,
            type: 'PLAYING'
        }
    })

    //list all servers the bot is connected to
    // console.log('\nServers:')
    client.guilds.cache.forEach((guild) => {
        // console.log(' - '+guild.name)

        //list all channels in the server
        guild.channels.cache.forEach((channel) => {
            // console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
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

client.on('message', async (receivedMessage) => {
    if(receivedMessage.author == client.user) {
        return
    }

    if(receivedMessage.channel.id == CHECKIN_CHANNEL_ID) {
        // run the checkIn function
        await checkin(receivedMessage)
        return;
    }
/* 
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

    console.log(receivedMessage.author.username + ' now has ' + userStats.xp) */

    if(receivedMessage.content.startsWith('!')) {
        processCommand(receivedMessage)
    }
})

/**
 * 
 * @param {Discord.Message} receivedMessage 
 */
function processCommand(receivedMessage) {
    const fullCommand = receivedMessage.content.substr(1)     //remove the leading/bot identifying character
    const splitCommand = fullCommand.split(" ")               //split the message up into pieces for each space
    const primaryCommand = splitCommand[0]                    //take the first string from the split
    const arguments = splitCommand.slice(1)                   //all other words are arguments/parameters for the primaryCommand

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
        case 'claim':
            score(arguments, receivedMessage)
            break
        case 'top':
            top(arguments, receivedMessage)
            break
        case 'hi':
        case 'revvit':
            revvit(arguments, receivedMessage)
            break
        case 'background':
            background(arguments, receivedMessage)
            break
        case 'sponsor':
        case 'mentor':
        case 'judge':
        case 'minor':
            checkin_prv(arguments, receivedMessage, primaryCommand)
            break;
    }
    
}
const token = require("./token")
const Discord = require('discord.js')

const help = require("./help")
const multiply = require("./multiply")
const react = require("./react")

const client = new Discord.Client()

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

    client.on('message', (receivedMessage) => {
        if(receivedMessage.author == client.user) {
            return
        }

        if(receivedMessage.content.startsWith('!')) {
            processCommand(receivedMessage)
        }
    })

})

function processCommand(receivedMessage) {
    let fullCommand = receivedMessage.content.substr(1)     //remove the leading/bot identifying character
    let splitCommand = fullCommand.split(" ")               //split the message up into pieces for each space
    let primaryCommand = splitCommand[0]                    //take the first string from the split
    let arguments = splitCommand.slice(1)                   //all other words are arguments/parameters for the primaryCommand

    console.log('command received: ' + primaryCommand)
    console.log('Arguments: ' + arguments)

    if (primaryCommand == "help") {
        help(arguments, receivedMessage)
    }
    else if (primaryCommand == 'multiply') {
        multiply(arguments, receivedMessage)
    }
    else if (primaryCommand == 'react') {
        react(arguments, receivedMessage)
    }
}

client.login(token)
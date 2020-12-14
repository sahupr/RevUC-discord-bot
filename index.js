const token = require("./token");
const Discord = require('discord.js')

const client = new Discord.Client()

client.once('ready', () => {
    console.log('the bot is online!')

    //list all servers the bot is connected to
    console.log('\nServers:')
    client.guilds.cache.forEach((guild) => {
        console.log(' - '+guild.name)

        //list all channels in the server
        guild.channels.cache.forEach((channel) => {
            console.log(` -- ${channel.name} (${channel.type}) - ${channel.id}`)
        })
    })


    //send a message to a specific channel
    var generalChannel = client.channels.cache.get('750373912738791567')
    generalChannel.send('hello world')    
    
})

client.on('message', (receivedMessage) => {
    //prevent bot from responding to its own message
    if(receivedMessage.author == client.user) {
        return
    }

    //bot responds to all messages in ALL channels in the server
    receivedMessage.channel.send("Message received from " + receivedMessage.author.toString() + ": " + receivedMessage.content)

    //bot responds to all messages in ALL channels it has been tagged in
    if(receivedMessage.content.includes(client.user.toString())) {
        receivedMessage.channel.send("Message received from " + receivedMessage.author.toString() + ": " + receivedMessage.content)
    }
})

client.login(token);
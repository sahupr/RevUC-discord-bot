const Discord = require('discord.js')

function react(arguments, receivedMessage) {
    receivedMessage.react('👍')
}

module.exports = react
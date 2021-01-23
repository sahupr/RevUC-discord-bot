const { Message, Client } = require("discord.js")
const Discord = require('discord.js')
const client = new Discord.Client()

// client.on('message', (msg) => {
//     if(msg.author == client.user) {
//         msg.delete({timeout: 1000})
//     }
// })

function countdownCommand(arguments, receivedMessage){
    if (arguments.length < 1) {
        receivedMessage.channel.send("time not specified, try again")
        return
    }
    if (arguments == 0) {
        receivedMessage.channel.send("invalid time, try again")
        return
    }

    else {
            arguments.forEach((value) => {
                time = value * 60000
            })
            var count = 1
            var timeLeft = setInterval(timer, 1000);
            function timer() {
                var minTimeDisplay = Math.round(time/60000)
                sectimeDisplay = time/1000
                sectimeDisplay = sectimeDisplay%60
                if (sectimeDisplay == 0 && minTimeDisplay > 1) {
                    receivedMessage.channel.send(minTimeDisplay.toString() + " mins left")
                }
                else if (sectimeDisplay == 0 && minTimeDisplay == 1) {
                    receivedMessage.channel.send(minTimeDisplay.toString() + " min left")
                }
                time = time - 1000
    
                if (time == 0) {
                    setTimeout(function() {
                        receivedMessage.channel.send('Timer up!')
                        clearInterval(timeLeft)
                        return
                    }, 1000)
                }
            }

        // setTimeout(function() { 
        //     setTimeout(function() { 
        //         receivedMessage.channel.send(time.toString() + " left")
        //     }, 1000) 
        // }, time)

        // setTimeout(function() {
        //     receivedMessage.delete()
        // }, 1000)

        // else if (count == 2) {
        //     receivedMessage.channel.edit(timeDisplay.toString() + " seconds left")
        //     time = time - 1000
        // }
    }
}
module.exports=countdownCommand
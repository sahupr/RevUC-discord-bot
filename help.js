function helpCommand(arguments, receivedMessage) {
    if(arguments.length > 0){
        receivedMessage.channel.send('add time in minutes - `!countdown 5`')
    }
    else{
        receivedMessage.channel.send('invalid input, try being more specific: something like `!help [topic]` ')
    }
}

module.exports=helpCommand
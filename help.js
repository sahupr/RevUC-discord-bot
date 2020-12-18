function helpCommand(arguments, receivedMessage) {
    if(arguments.length > 0){
        receivedMessage.channel.send('help required with: ' + arguments)
    }
    else{
        receivedMessage.channel.send('invalid input, try being more specific: something like `!help [topic]` ')
    }
}

module.exports=helpCommand
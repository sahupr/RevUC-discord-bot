function helpCommand(args, receivedMessage) {
    if(args.length < 1){
        receivedMessage.channel.send('specify what you need help for:\n `!revvit` \n `!help checkin` \n `!help codes`')
    }
    else{
        const topic = args[0]
        switch(topic) {
            case 'checkin':
                console.log('checkin prompt')
                receivedMessage.channel.send('Type the email you registered with out on the checkin channel to check in to RevolutionUC. Ex: `foo@bar.com`')
                break
            case 'codes':
                receivedMessage.channel.send('Use the bot command `!claim CODE` to claim your participation points')
                break
            default:
                receivedMessage.channel.send('Invalid bot command')
                throw new Error(`Invalid command`)
        }
    }
}

module.exports=helpCommand
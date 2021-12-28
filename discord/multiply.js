function multiplyCommand(arguments, receivedMessage){
    if(arguments.length < 2) {
        receivedMessage.channel.send("not enough values to multiply, enter more numbers seperated with a space")
        return
    }
    else {
        let product = 1
        arguments.forEach((value) => {
            product = product * parseFloat(value)
        })
        receivedMessage.channel.send("The product of " + arguments + " is " + product.toString())
    }
}

module.exports=multiplyCommand
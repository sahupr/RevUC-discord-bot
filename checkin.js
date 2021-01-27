const Discord = require('discord.js')
const emailValidator = require('email-validator')

/**
 * 
 * @param {string} email 
 * @param {Discord.Message} message 
 */
module.exports = function(email, message) {
  // send a request to revuc api to check in the email

    // if check in failed, return with an error message
    if(emailValidator.validate(email.toString()) && message.channel.id === '803803905712324638') {
      
      console.log('valid email')
      
      // check in succeeded
      const user = message.author.id
      
      // grant the hacker role
      const member = message.guild.members.cache.find((member) => member.id === user.toString())
      let testRole = message.guild.roles.cache.find(role => role.id === "803776127482724373")     //the role ID needs to change
      member.roles.add(testRole)
      
      // censor the original message
      // devagrawal09@gmail.com
      // d****9@gmail.com

      let ptEmail = email.toString()
      let letter = ''
      let stars = ''
      i=0
      while(letter != '@'){
        letter = ptEmail[i]
        i += 1
        stars += '*'
      }
      let censor = ptEmail.slice(1,i-2)
      stars = stars.substr(1,i-3)
      message.delete({timeout: 3000})
      message.channel.send(ptEmail.replace(censor, stars) + ' is checked in!')
    }
    else {
      console.log('invalid email')
      message.delete({timeout: 3000})
    }
      // registrant with this email does not exist
      // server error somewhere
    
      // return with a success prompt

}
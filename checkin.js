const Discord = require('discord.js')

/**
 * 
 * @param {string} email 
 * @param {Discord.Message} message 
 */
module.exports = function(email, message) {
  // send a request to revuc api to check in the email

    // if check in failed, return with an error message
      // registrant with this email does not exist
      // server error somewhere

    // check in succeeded
      const registrant = response.data
      // grant the hacker role
      const role = message.guild.roles.cache.find(role => role.name === 'Hacker')
      const user = message.author

      // return with a success prompt

    // censor the original message
      // devagrawal09@gmail.com
      // d****9@gmail.com

}
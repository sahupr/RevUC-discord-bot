const Discord = require('discord.js')
const emailValidator = require('email-validator')
const Axios = require('axios').default

const API_TOKEN = process.env.API_TOKEN

/**
 * 
 * @param {Discord.Message} message 
 */
module.exports = async function(message) {
  const email = message.toString();

  if(emailValidator.validate(email) && message.channel.id === '803803905712324638') {
    // send a request to revuc api to check in the email
    try {
      const res = await Axios.post(`https://revolutionuc-api.herokuapp.com/api/v2/admin/registrants/checkin?email=${email}`, {}, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`
        }
      })

      const { firstName, lastName } = res.data

      // check in succeeded
      const user = message.author.id
      
      // grant the hacker role
      const member = message.guild.members.cache.find(member => member.id === user)
      const testRole = message.guild.roles.cache.find(role => role.id === "803776127482724373")     //the role ID needs to change
      member.roles.add(testRole)

    } catch (err) {
      // if check in failed, return with an error message
      
    }

      // censor the original message
      // devagrawal09@gmail.com
      // d****9@gmail.com

      let ptEmail = email
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
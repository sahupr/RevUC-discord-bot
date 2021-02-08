const Discord = require('discord.js')
const emailValidator = require('email-validator')
const Axios = require('axios').default

const API_TOKEN = process.env.API_TOKEN
const HACKER_ROLE = process.env.HACKER_ROLE
const CHECKIN_CHANNEL_ID = process.env.CHECKIN_CHANNEL_ID

/**
 * 
 * @param {Discord.Message} message 
 */
module.exports = async function(args, message) {
  const email = args[0];
  console.log(email)
  console.log(message)

  if(emailValidator.validate(email) && message.channel.id === CHECKIN_CHANNEL_ID) {
    // send a request to revuc api to check in the email
    try {
      const res = await Axios.post(`http://192.168.0.102/api/v2/attendee/checkin`, { email }, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`
        }
      })

      const { name, role } = res.data

      let roleToBeAdded;

      switch(role) {
        case `HACKER`:
          roleToBeAdded = HACKER_ROLE;
          break;
        default:
          throw new Error(`Invalid role`);
      }

      // check in succeeded
      const user = message.author.id
      
      // grant the hacker role
      const member = message.guild.members.cache.find(member => member.id === user)
      const testRole = message.guild.roles.cache.find(role => role.id === roleToBeAdded)     //the role ID needs to change
      member.roles.add(testRole)

      message.channel.send(name + ' is checked in!')
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
      message.edit(ptEmail.replace(censor, stars));
      message.delete({timeout: 3000})
    }
    else {
      console.log('invalid email')
      message.delete({timeout: 3000})
    }
      // registrant with this email does not exist
      // server error somewhere
    
      // return with a success prompt

}
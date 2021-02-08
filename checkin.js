const Discord = require('discord.js')
const emailValidator = require('email-validator')
const Axios = require('axios').default

const API_TOKEN = process.env.API_TOKEN
const HACKER_ROLE = process.env.HACKER_ROLE
const JUDGE_ROLE = process.env.JUDGE_ROLE
const CHECKIN_CHANNEL_ID = process.env.CHECKIN_CHANNEL_ID

/**
 * 
 * @param {string} email
 */
const censorEmail = email => {
  const ptEmail = email
  let letter = ''
  let stars = ''
  let i=0
  while(letter != '@' && i < email.length){
    letter = ptEmail[i]
    i += 1
    stars += '*'
  }
  let censor = ptEmail.slice(1,i-2)
  stars = stars.substr(1,i-3)
  return ptEmail.replace(censor, stars)
}

/**
 * 
 * @param {Discord.Message} message 
 */
module.exports = async function(message) {
  const email = message.toString();

  if(emailValidator.validate(email) && message.channel.id == CHECKIN_CHANNEL_ID) {
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
        case `JUDGE`:
          roleToBeAdded = JUDGE_ROLE;
          break;
        default:
          throw new Error(`Invalid role`);
      }

      // check in succeeded
      const user = message.author.id
      
      // grant the hacker role
      const member = message.guild.members.cache.find(member => member.id === user)
      const testRole = message.guild.roles.cache.find(role => role.id === roleToBeAdded)
      member.roles.add(testRole)

      const censoredEmail = censorEmail(email);
      console.log({ censoredEmail })

      message.channel.send(`${name} <${censoredEmail}> is checked in!`)
    } catch (err) {
      if(err.response.status === 404) {
        message.channel.send(`Attendee with email ${censorEmail(email)} does not exist, please make sure you are registered with us or contact an organizer`)
      } else {
        message.channel.send(`Error checking in ${censorEmail(email)}, please try again later or contact an organizer`)
      }
    }

    message.delete({ timeout: 2000 })
  } else {
    const censored = censorEmail(email);
    message.channel.send(`${censored} is not a valid email`)
    message.delete({timeout: 3000})
  }
}
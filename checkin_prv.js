const Discord = require('discord.js')
const emailValidator = require('email-validator')
const Axios = require('axios').default


module.exports = async function(args, message) {

    if(args.length < 1){
        receivedMessage.channel.send('email not specified\n'+`!${message} email@domain.com`)
    }
    else {
        var email = args[0].toString()
        var name = (args[1]+' '+args[2]).toString()
        
        if(emailValidator.validate(email) && message.channel.id == TOP_CHANNEL_ID) {
            try {
              await Axios.post(`https://revolutionuc-api.herokuapp.com/api/v2/attendee`, { name, email, role }, {
                  headers: {
                      Authorization: `Bearer ${API_TOKEN}`
                  }
              })
        
              let roleToBeAdded;
        
              switch(message) {
                case `JUDGE`:
                  roleToBeAdded = JUDGE_ROLE;
                  break;
                  case `SPONSOR`:
                  roleToBeAdded = SPONSOR_ROLE;
                  break;
                case `MENTOR`:
                  roleToBeAdded = MENTOR_ROLE;
                  break;
                default:
                  throw new Error(`Invalid role`);
              }
        
              //changes from here

              // check in succeeded
              const user = message.author.id
              
              // grant the hacker role
              const member = message.guild.members.cache.find(member => member.id === user)
              const Role = message.guild.roles.cache.find(role => role.id === roleToBeAdded)
              member.roles.add(Role)
         
              const censoredEmail = censorEmail(email);
        
              message.channel.send(`${name} <${censoredEmail}> ${responses_success[getRandomInt(max_success)]}`)
            } catch (err) {
              console.error(err)
              if(err.response?.status === 404) {
                message.channel.send(`${censorEmail(email)} ${responses_404[getRandomInt(max_404)]}, please make sure you are registered with us or contact an organizer`)
              } else if (err.response?.status === 403) {
                  message.channel.send(`${censorEmail(email)} ${responses_403[getRandomInt(max_403)]}`)
              }
              else {
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
    }
    
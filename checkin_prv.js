const Discord = require('discord.js')
const Axios = require('axios').default

const API_TOKEN = process.env.API_TOKEN
const TOP_CHANNEL_ID = process.env.TOP_CHANNEL_ID

/**
 * 
 * @param {string[]} args
 * @param {Discord.Message} message
 * @param {'sponsor' | 'mentor' | 'judge'} primaryCommand
 */
module.exports = async function (args, message, primaryCommand) {
  if (args.length < 2) {
    message.channel.send(`Invalid command format! Please specify role, email and name.`)
  } else {
    const email = args.shift()
    const name = args.join(` `)
    const role = primaryCommand.toUpperCase()

    if (message.channel.id == TOP_CHANNEL_ID) {
      try {
        await Axios.post(
          `https://revolutionuc-api.herokuapp.com/api/v2/attendee`,
          { email, name, role },
          { headers: { Authorization: `Bearer ${API_TOKEN}` } }
        )

        message.channel.send(`Created ${role} ${name} <${email}>`)
      } catch (err) {
        console.error(err)
        if (err.response?.status === 400) {
          message.channel.send(`Attendee with email ${email} already exists!`)
        } else {
          message.channel.send(`Error creating attendee ${email}, please try again later or contact the Super User Dev Olpowerful (SUDO).`)
        }
      }
    }
  }
}

const Discord = require('discord.js')
const { TextChannel } = require('discord.js')
const client = require('./client')

const ADMIN_CHANNEL_ID = process.env.ADMIN_CHANNEL_ID

module.exports = async (data) => {
  const adminChannel = await client.channels.fetch(ADMIN_CHANNEL_ID)

  const update = new Discord.MessageEmbed()
    .setTitle('Daily Regstration Update')
    .setURL(`https://stats.revolutionuc.com/`)
    .addFields([
      {
        name: 'Total Registrants',
        value: data.total.registrants,
      },
      {
        name: 'Registered in last 24hrs',
        value: data.last24hrs.registrants,
      },
      {
        name: 'Total Confirmed',
        value: data.total.confirmed,
      },
      {
        name: 'Confirmed in last 24hrs',
        value: data.last24hrs.confirmed,
      }
    ])
    .setTimestamp()

  await adminChannel.send(update)
}
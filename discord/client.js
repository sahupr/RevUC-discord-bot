const { Discord, Client, Intents } = require('discord.js')

const DISCORD_TOKEN = process.env.DISCORD_TOKEN

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]})

client.login(DISCORD_TOKEN)

module.exports = client

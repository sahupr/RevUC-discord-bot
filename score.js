const Discord = require('discord.js')
const { User, Event, sequelize, Claim } = require('./database')

const CLAIM_CHANNEL_ID = process.env.CLAIM_CHANNEL_ID
const TOP_CHANNEL_ID = process.env.TOP_CHANNEL_ID
// sequelize.sync()

/**
 * 
 * @param {string[]} args 
 * @param {Discord.Message} receivedMessage 
 */
async function score(args, receivedMessage) {
  if(receivedMessage.channel.id != CLAIM_CHANNEL_ID) {
    return
  }

  try {
    let user = await User.findByPk(receivedMessage.author.id)

    if (!user) {
      user = await User.create({ userID: receivedMessage.author.id, username: receivedMessage.author.username })
    }

    const code = args[0]

    const event = await Event.findByPk(code)

    if(event) {
      const claim = await Claim.findOne({ where: { userID: receivedMessage.author.id, eventCode: code } })

      if (claim) {
        receivedMessage.channel.send('Code already claimed')
      } else {
        const currentScore = user.score
        const newScore = currentScore + event.points
        user.set(`score`, newScore)
        await user.save()
        await Claim.create({ userID: receivedMessage.author.id, eventCode: code })
        receivedMessage.channel.send(`Hey ${receivedMessage.author.username}, thank you for attending ${event.name}, you now have ${newScore} points`)
      }
    } else {
      receivedMessage.channel.send('Nice try')
    }
  } catch(err) {
    console.error(err);
    receivedMessage.channel.send(`Hey ${receivedMessage.author.username}, there was an error while trying to grant you score, please contact an organizer!`)
  } finally {
    receivedMessage.delete()
  }
}

/**
 * 
 * @param {string[]} args 
 * @param {Discord.Message} receivedMessage 
 */
async function top(args, receivedMessage) {
  if(receivedMessage.channel.id != TOP_CHANNEL_ID) {
    return
  }

  const users = await User.findAll({ order: [['score', 'DESC']], limit: parseInt(args[0]) })
  let list = `\`\`\`\n`

  users.forEach((user, i) => list += `${i + 1} @${user.username} - score: ${user.score}\n`)

  list += `\`\`\``
  receivedMessage.channel.send(list)
}

exports.score = score
exports.top = top
const Discord = require('discord.js')
const { NONE } = require('sequelize')
const { User, Event, sequelize, Claim } = require('./database')

const CLAIM_CHANNEL_ID = process.env.CLAIM_CHANNEL_ID
const TOP_CHANNEL_ID = process.env.TOP_CHANNEL_ID
// sequelize.sync()

/**
 * 
 * @param {string[]} args 
 * @param {Discord.Message} receivedMessage 
 */

function generateResponse(name, event, score, r_id) {
  
  const getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max));
  }

  const claim_success = [
    `Good job attending ${event.name}, you now have ${score} points. Now go attend another one.`,
    `Ayy nice job ${name}. Hope you enjoyed ${event.name}! You now have ${score} points.` 
  ]
  
  const code_wrong = [  //Doesn't take points for now
    `Stop cheating ${name}!`,
    `Nice try!`,
    `I’m sorry ${name}, but we never gave you that code. Please try a code that works.`,
    `${name} Did you just make that up? Because I sure don’t know this code.`
  ]
  
  const code_claimed = [  //Doesn't take points for now
    `Oops, sorry that code has already been claimed`,
    `You’ve already attended ${event.name}, good job!`,
    `Unless you invented time travel, you can’t attend ${event.name} twice` 
  ]

  if(r_id == 1){
    return claim_success[getRandomInt(claim_success.length)]
  }
  else if(r_id == 2){
    return code_wrong[getRandomInt(code_wrong.length)]
  }
  else if(r_id == 3){
    return code_claimed[getRandomInt(code_claimed.length)]
  }
}

async function score(args, receivedMessage) {
  if(receivedMessage.channel.id != CLAIM_CHANNEL_ID) {
    console.log('wrong channel')
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
        var claimedResponse = generateResponse(receivedMessage.author.username, event, NONE, 3)
        receivedMessage.channel.send(claimedResponse)
      } 
      else {
        const currentScore = user.score
        const newScore = currentScore + event.points
        user.set(`score`, newScore)
        await user.save()
        await Claim.create({ userID: receivedMessage.author.id, eventCode: code })
        var successResponse = generateResponse(receivedMessage.author.username, event, newScore, 1)
        receivedMessage.channel.send(successResponse)
        // receivedMessage.channel.send(`Hey ${receivedMessage.author.username}, thank you for attending ${event.name}, you now have ${newScore} points`)   //correct code
      }
    } 
    else {
      var wrongResponse = generateResponse(receivedMessage.author.username, NONE, NONE, 2)
      receivedMessage.channel.send(wrongResponse)
      // receivedMessage.channel.send('Nice try')   //wrong code
    }
  } catch(err) {
    console.error(err);
    receivedMessage.channel.send(`Hey ${receivedMessage.author.username}, there was an error while trying to grant you score, please contact an organizer!`)   //invalid code
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
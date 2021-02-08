const Discord = require('discord.js')
const { User, Event, sequelize, Claim } = require('./database');
const random = require('random');

// const ParticipationCodes = ['REVUC2021OC', 'NICETOMEETYALL', 'HACKINGINTENSIFIES', 'W1SOFUN', 'SUPERCOOLW2', 'YOUMEANDW3', 'W4RULES', 'SPIDERWEBS', 'SIOTPLAYER', 'CHITCHATSH', 'FRIENDLYTREES', 'GOTOSLEEP', 'QOTHISLIT', 'NOMORESITTING', 'UNTILNEXTYEAR']
const CLAIM_CHANNEL_ID = process.env.CLAIM_CHANNEL_ID;
// sequelize.sync()
/**
 * 
 * @param {string[]} args 
 * @param {Discord.Message} receivedMessage 
 */
async function score(args, receivedMessage) {
  if(receivedMessage.channel.id != CLAIM_CHANNEL_ID) {
    return;
  }

  let user = await User.findByPk(receivedMessage.author.id);

  if (!user) {
    user = await User.create({ userID: receivedMessage.author.id });
  }

  const code = args[0];

  const event = await Event.findByPk(code);

  if(event) {
    const claim = await Claim.findOne({where:{userID: receivedMessage.author.id, eventCode: code}})
    if (claim) {
      receivedMessage.channel.send('Code already claimed')
      return
    }
    const currentScore = user.score;
    const newScore = currentScore + event.points;
    user.set(`score`, newScore);
    await user.save();
    await Claim.create({userID: receivedMessage.author.id, eventCode: code, claimID: random.int(1, 2000)});

    receivedMessage.channel.send(`Hey ${receivedMessage.author.username}, thank you for attending ${event.name}, you now have ${newScore} points`);
  } else {
    receivedMessage.channel.send('Nice try');
  }

}

/**
 * 
 * @param {string[]} args 
 * @param {Discord.Message} receivedMessage 
 */
async function top(args, receivedMessage) {
  /* const users = await User.findAll({ order: [['score', 'DESC']], limit: parseInt(args[0]) });
  let list = `\`\`\`\n`;
  // console.log({ users });
  const guildUsers = await receivedMessage.guild.members.fetch();
  console.log({ guildUsers: guildUsers.map(g => g.user) });

  users.forEach((user, i) => {
    const gu = guildUsers.find(u => u.user.id === user.userID);
    // console.log({ id: user.userID, gu });
    const { user: { username } } = gu;
    list += `${i + 1} ${username} - score: ${user.score}\n`;``
  });

  list += `\`\`\``;
  console.log(list);
  receivedMessage.channel.send(list); */

  receivedMessage.channel.send(`Under construction!`);
}

exports.score = score;
exports.top = top;
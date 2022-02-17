const Discord = require("discord.js");
const { User, Event, Claim } = require("../database");

const CLAIM_CHANNEL_ID = process.env.CLAIM_CHANNEL_ID;
const TOP_CHANNEL_ID = process.env.TOP_CHANNEL_ID;

const RESPONSE = {
  SUCCESS: 1,
  WRONG: 2,
  CLAIMED: 3,
};

const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max));

function generateResponse(name, event, score, responseType) {
  const claim_success = [
    `Good job attending ${event?.name}, you now have ${score} points. Now go attend another one.`,
    `Ayy nice job ${name}. Hope you enjoyed ${event?.name}! You now have ${score} points.`,
  ];

  const code_wrong = [
    //Doesn't take points for now
    `Stop cheating ${name}!`,
    `Nice try!`,
    `I’m sorry ${name}, but we never gave you that code. Please try a code that works.`,
    `${name} Did you just make that up? Because I sure don’t know this code.`,
  ];

  const code_claimed = [
    //Doesn't take points for now
    `Oops, sorry that code has already been claimed`,
    `You’ve already attended ${event?.name}, good job!`,
    `Unless you invented time travel, you can’t attend ${event?.name} twice`,
  ];

  if (responseType === RESPONSE.SUCCESS) {
    return claim_success[getRandomInt(claim_success.length)];
  }
  if (responseType === RESPONSE.WRONG) {
    return code_wrong[getRandomInt(code_wrong.length)];
  }
  if (responseType === RESPONSE.CLAIMED) {
    return code_claimed[getRandomInt(code_claimed.length)];
  }
}

/**
 *
 * @param {string[]} args
 * @param {Discord.Message} receivedMessage
 */
async function score(args, receivedMessage) {
  if (receivedMessage.channel.id != CLAIM_CHANNEL_ID) {
    console.log("wrong channel");
    return;
  }

  try {
    let user = await User.findByPk(receivedMessage.author.id);

    if (!user) {
      receivedMessage.channel.send(
        `Hey ${receivedMessage.author.username}, you are not checked in to RevUC, so either you hacked into the server, in which case you will be banned shortly, or you are an organizer, in which case, stop smurfing!`
      );
    } else {
      const code = args[0];

      const event = await Event.findByPk(code);

      if (event) {
        const claim = await Claim.findOne({
          where: { userID: receivedMessage.author.id, eventCode: code },
        });

        if (claim) {
          const claimedResponse = generateResponse(
            receivedMessage.author.username,
            event,
            null,
            RESPONSE.CLAIMED
          );
          receivedMessage.channel.send(claimedResponse);
        } else {
          const currentScore = user.score;
          const newScore = currentScore + event.points;
          user.set(`score`, newScore);
          await user.save();
          await Claim.create({
            userID: receivedMessage.author.id,
            eventCode: code,
          });
          const successResponse = generateResponse(
            receivedMessage.author.username,
            event,
            newScore,
            RESPONSE.SUCCESS
          );
          receivedMessage.channel.send(successResponse);
        }
      } else {
        const wrongResponse = generateResponse(
          receivedMessage.author.username,
          null,
          null,
          RESPONSE.WRONG
        );
        receivedMessage.channel.send(wrongResponse);
      }
    }
  } catch (err) {
    console.error(err);
    receivedMessage.channel.send(
      `Hey ${receivedMessage.author.username}, there was an error while trying to grant you score, please contact an organizer!`
    );
  } finally {
    receivedMessage.delete();
  }
}

/**
 *
 * @param {string[]} args
 * @param {Discord.Message} receivedMessage
 */
async function top(args, receivedMessage) {
  if (receivedMessage.channel.id != TOP_CHANNEL_ID) {
    return;
  }

  const users = await User.findAll({
    order: [["score", "DESC"]],
    limit: parseInt(args[0]),
  });
  let list = `\`\`\`\n`;

  users.forEach(
    (user, i) => (list += `${i + 1} @${user.username} - score: ${user.score}\n`)
  );

  list += `\`\`\``;
  receivedMessage.channel.send(list);
}

exports.score = score;
exports.top = top;

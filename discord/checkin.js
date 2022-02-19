const Discord = require("discord.js");
const emailValidator = require("email-validator");
const Axios = require("axios").default;
const { User } = require("../database");

const API_TOKEN = process.env.API_TOKEN;
const HACKER_ROLE = process.env.HACKER_ROLE;
const JUDGE_ROLE = process.env.JUDGE_ROLE;
const MENTOR_ROLE = process.env.MENTOR_ROLE;
const SPONSOR_ROLE = process.env.SPONSOR_ROLE;
const CHECKIN_CHANNEL_ID = process.env.CHECKIN_CHANNEL_ID;
const MINOR_ROLE = process.env.MINOR_ROLE;

/**
 *
 * @param {string} email
 */
const censorEmail = (email) => {
  const ptEmail = email;
  let letter = "";
  let stars = "";
  let i = 0;
  while (letter != "@" && i < email.length) {
    letter = ptEmail[i];
    i += 1;
    stars += "*";
  }
  let censor = ptEmail.slice(1, i - 2);
  stars = stars.substr(1, i - 3);
  return ptEmail.replace(censor, stars);
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const responses_success = [
  "is checked in!",
  ", welcome to the main event!",
  "is here!",
  "welcome onboard!",
  "has arrived!",
];

const responses_404 = [
  "does not exist",
  "cannot be found",
  ", are you using the right email?",
];

const responses_403 = [
  "you're already checked in.",
  "already exists, is this a clone?",
  "you've already signed up!",
];

/**
 *
 * @param {Discord.Message} message
 */
module.exports = async function (message) {
  const email = message.toString();

  const max_success = responses_success.length;
  const max_404 = responses_404.length;
  const max_403 = responses_403.length;

  const censoredEmail = censorEmail(email);

  if (
    emailValidator.validate(email) &&
    message.channel.id == CHECKIN_CHANNEL_ID
  ) {
    try {
      // send a request to revuc api to check in the email
      const res = await Axios.post(
        `https://revolutionuc-api.herokuapp.com/api/v2/attendee/checkin`,
        { email },
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      const { name, role, isMinor } = res.data;

      let roleToBeAdded;

      switch (role) {
        case `HACKER`:
          roleToBeAdded = HACKER_ROLE;
          break;
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

      // check in succeeded
      const user = message.author.id;

      // grant the hacker role
      const member = message.guild.members.cache.find(
        (member) => member.id === user
      );
      const Role = message.guild.roles.cache.find(
        (role) => role.id === roleToBeAdded
      );
      member.roles.add(Role);

      if (isMinor == true) {
        const minorRole = message.guild.roles.cache.find(
          (role) => role.id == MINOR_ROLE
        );
        member.roles.add(minorRole);
      }

      if (role === `HACKER`) {
        await User.create({
          userID: message.author.id,
          username: message.author.username,
          email
        });
      }

      var checkin_success = await message.channel.send(
        `${name} <${censoredEmail}> ${
          responses_success[getRandomInt(max_success)]
        }`
      );
      checkin_success.delete({ timeout: 20000 });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 404) {
        var err_404 = await message.channel.send(
          `${censoredEmail} ${
            responses_404[getRandomInt(max_404)]
          }, please make sure you are registered with us or contact an organizer`
        );
        err_404.delete({ timeout: 20000 });
      } else if (err.response?.status === 403) {
        var err_403 = await message.channel.send(
          `${censoredEmail} ${responses_403[getRandomInt(max_403)]}`
        );
        err_403.delete({ timeout: 20000 });
      } else {
        var err_other = await message.channel.send(
          `Error checking in ${censoredEmail}, please try again later or contact an organizer`
        );
        err_other.delete({ timeout: 20000 });
      }
    }

    message.delete({ timeout: 2000 });
  } else {
    var invalid_email = await message.channel.send(`${censoredEmail} is not a valid email`);
    message.delete({ timeout: 3000 });
    invalid_email.delete({ timeout: 30000 });
  }
};

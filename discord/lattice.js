const Discord = require("discord.js");
const Axios = require("axios").default;
const { User } = require("../database");

const API_TOKEN = process.env.API_TOKEN;

const latticeSkills = [];

Axios.get(`https://revolutionuc-api.herokuapp.com/api/v2/lattice/skills`).then(
  (res) => latticeSkills.push(...res.data)
);

/**
 *
 * @param {Discord.Message} receivedMessage
 */
async function latticeCommand(receivedMessage) {
  try {
    let user = await User.findByPk(receivedMessage.author.id);

    if (!user) {
      receivedMessage.channel.send(
        `Hey ${receivedMessage.author.username}, you are not checked in to RevUC, so either you hacked into the server, in which case you will be banned shortly, or you are an organizer, in which case, stop smurfing!`
      );
    } else {
      const { data: profile } = await Axios.get(
        `https://revolutionuc-api.herokuapp.com/api/v2/lattice/admin/profile?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      // name and idea are strings, skills and lookingFor are arrays of strings
      const { name, skills, idea, lookingFor } = profile;

      message.channel.send(
        `${name}: Skills: ${skills.join(
          ", "
        )}, Idea: ${idea}, Looking for: ${lookingFor.join(", ")}`
      );
    }
  } catch (err) {
    console.error(err);
    receivedMessage.channel.send(
      `Hey ${receivedMessage.author.username}, there was an error contacting the server, please report to an organizer!`
    );
  }
}

module.exports = latticeCommand;

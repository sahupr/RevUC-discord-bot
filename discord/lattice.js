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
    const discordUsername = receivedMessage.author.username;

    if (!user) {
      receivedMessage.channel.send(
        `Hey ${discordUsername}, you are not checked in to RevUC, so either you hacked into the server, in which case you will be banned shortly, or you are an organizer, in which case, stop smurfing!`
      );
    } else {
      const { data: profile } = await Axios.get(
        `https://revolutionuc-api.herokuapp.com/api/v2/lattice/admin/profile?email=${user.email}`,
        {
          headers: {
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      // `name` and `idea` are strings, `skills` and `lookingFor` are arrays of strings
      const { name, skills, idea, lookingFor, visible } = profile;

      if (!visible) {
        receivedMessage.channel.send(`Hey ${discordUsername}, your lattice profile is hidden. If you want to show it here, please go to https://lattice.revolutionuc.com/profile and click on "Mark Visible".`)
      } else {
        // Else, send an embed with the Hacker's profile info
        const discordFullUsername = `${discordUsername}#${receivedMessage.author.discriminator}`;
        const infoEmbed = new Discord.MessageEmbed()
          .setColor("#008C8C") // Mars Green color
          .setAuthor({ name: "RevUC Hacker Profile", iconURL: "https://assets.revolutionuc.com/logo-128.png" })
          .setTitle(`${name} @${discordFullUsername}`)
          .addFields(
            { name: "Idea", value: idea },
            { name: "Skills", value: skills.join(", ") },
            { name: "Looking for", value: lookingFor.join(", ") }
          )

        receivedMessage.channel.send({ embeds: [infoEmbed] })
      }

    }
  } catch (err) {
    console.error(err);
    receivedMessage.channel.send(
      `Hey ${receivedMessage.author.username}, looks like you haven't signed up for lattice yet! If you are having issues with creating a lattice profile, or if you have already signed up and are still getting this error, please @Organizer.`
    );
  }
}

module.exports = latticeCommand;

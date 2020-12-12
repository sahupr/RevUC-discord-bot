const token = require("./token");

const Discord = require('discord.js');

const client = new Discord.Client();

client.once('ready', () => {
    console.log('the bot is online!');
});


client.login(token);
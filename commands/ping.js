// Imports

const { SlashCommandBuilder } = require('discord.js')

// Ping... Pong!

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong!!'),

    async execute(interaction) {
        await interaction.reply('pong!')
    }
}
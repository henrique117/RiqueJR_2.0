const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sexo')
        .setDescription('Sexooooo!!'),

    async execute(interaction) {
        await interaction.reply('sexo!')
    }
}
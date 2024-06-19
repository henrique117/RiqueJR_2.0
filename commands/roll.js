// Imports

const { SlashCommandBuilder } = require('discord.js')

// Roll

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll')
        .setDescription('Sorteia um número')
        .addStringOption(option =>
            option.setName('limite')
            .setDescription('limite do número')
            .setRequired(false)),

    async execute(interaction) {

        var limit = parseInt(interaction.options.getString('limite'))

        if(limit) {
            if(limit < 2) return await interaction.reply({ content: 'O número tem q ser maior que 1', ephemeral: true })
            if(limit > 10000) return await interaction.reply({ content: 'Esse número é muito grande!', ephemeral: true })
        } else {
            limit = 100
        }

        const number = parseInt((Math.random() * limit)) + 1
        
        await interaction.reply(`Você rodou ${number}!`)
    }
}
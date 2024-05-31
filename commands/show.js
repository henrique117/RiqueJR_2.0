// Imports

const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

// Since we got 37 users in the bot, i'll have to change this one in the next patch, i'll comment that later, but for now it shows a list of all the players in the bot

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show')
        .setDescription('Mostra os usuarios cadastrados'),

    async execute(interaction) {
        const target = interaction.user

        const userList = await Usuario.findAll({ 
            attributes: ['nome', 'balance'],
            order: [['balance', 'DESC']]
        })
        const userString = '**TOP COINS DO BOT:**\n\n' + userList.map(u => u.nome + ' - ' + u.balance + ' coins').join('\n') || 'Não tem registros!'
        interaction.reply(userString)
    }
}
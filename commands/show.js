const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

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
        const userString = userList.map(u => u.nome + ' - ' + u.balance + ' coins').join('\n') || 'Não tem registros!'
        interaction.reply(userString)
    }
}
const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('show')
        .setDescription('Mostra os usuarios cadastrados'),

    async execute(interaction) {
        const target = interaction.user

        if(target.id === '520994132458471438') {
            const userList = await Usuario.findAll({ attributes: ['nome', 'balance'] })
            const userString = userList.map(u => u.nome + ' ' + u.balance).join('\n') || 'Não tem registros!'
            interaction.reply(userString)
        } else interaction.reply('Você não tem permissão pra usar esse comando')
    }
}
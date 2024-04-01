const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wallet')
        .setDescription('Mostra sua quantidade de coins'),

    async execute(interaction) {
        const target = interaction.user

        const userBalance = await Usuario.findOne({ where: { user_id: target.id } })

        if(userBalance) {
            interaction.reply(`Você possui **${userBalance.balance} coins** na sua carteira`)
        } else interaction.reply('Você precisa estar registrado para usar esse comando, se registre usando o comando **/register**')
        
    }
}
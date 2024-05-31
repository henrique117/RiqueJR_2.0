// Imports

const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

// This command show how many coins the user have

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wallet')
        .setDescription('Mostra sua quantidade de coins'),

    async execute(interaction) {
        const target = interaction.user // Get the command user info

        const userBalance = await Usuario.findOne({ where: { user_id: target.id } }) // Get the infos from DB

        if(userBalance) {
            interaction.reply(`Você possui **${userBalance.balance} coins** na sua carteira`) // Shows the balance in the server
        } else interaction.reply('Você precisa estar registrado para usar esse comando, se registre usando o comando **/register**')
        
    }
}
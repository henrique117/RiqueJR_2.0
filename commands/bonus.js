// Imports

const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

// This command is similar to the 'add' comand, but this time just add any ammount to every bot user, just me can use it

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bonus')
        .setDescription('Caso necessário')
        .addStringOption(option =>
            option.setName('amount')
            .setDescription('Quantia a ser inserida')
            .setRequired(true)),

//  Getting the information in the constants

    async execute(interaction) {
        const target = interaction.user
        const bonusToAdd = interaction.options.getString('amount')

        // User check

        if(target.id === '520994132458471438') {

            // Getting all users balance and ID

            const userList = await Usuario.findAll({ 
                attributes: ['user_id', 'balance'],
                order: [['balance', 'DESC']]
            })

            // Adding the ammount of coins for each user in the bot

            userList.forEach(async u => {
                const newAmount = u.balance + parseInt(bonusToAdd)
                const adding = await Usuario.update({ balance: newAmount }, { where: { user_id: u.user_id } })
            });

            interaction.reply(`Todos receberam **${bonusToAdd} coins**!! Perdão pelo tempo fora`)

        } else {
            interaction.reply('Você não pode usar esse comando!')
        }
    }
}
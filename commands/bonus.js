const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bonus')
        .setDescription('Caso necessário')
        .addStringOption(option =>
            option.setName('amount')
            .setDescription('Quantia a ser inserida')
            .setRequired(true)),

    async execute(interaction) {
        const target = interaction.user
        const bonusToAdd = interaction.options.getString('amount')

        if(target.id === '520994132458471438') {

            const userList = await Usuario.findAll({ 
                attributes: ['user_id', 'balance'],
                order: [['balance', 'DESC']]
            })

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
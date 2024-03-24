const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Adiciona coins para um usuário')
        .addUserOption(option =>
            option.setName('id')
            .setDescription('ID do usuário que você deseja adicionar coins')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('amount')
            .setDescription('Quantia a ser inserida')
            .setRequired(true)),

    async execute(interaction) {
        const idToAdd = interaction.options.getUser('id')
        const amountToAdd = interaction.options.getString('amount')
        const commandUser = interaction.user

        if(commandUser.id === '520994132458471438') {
            const row = await Usuario.findOne({ where: { user_id: idToAdd.id } })
            
            if(row) {
                const newAmount = row.balance + parseInt(amountToAdd)

                const adding = await Usuario.update({ balance: newAmount }, { where: { user_id: idToAdd.id } })

                interaction.reply(`${amountToAdd} coins foram adicionados para *${row.nome}*`)
            }

        } else interaction.reply('Você não tem permissão pra usar esse comando')
    }
}
const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('transfer')
        .setDescription('Transfere coins para um usuário')
        .addUserOption(option =>
            option.setName('id')
            .setDescription('ID do usuário que você deseja enviar coins')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('amount')
            .setDescription('Quantia a ser tranferida')
            .setRequired(true)),

    async execute(interaction) {
        const idToAdd = interaction.options.getUser('id')
        const amountToTransfer = interaction.options.getString('amount')
        const commandUser = interaction.user

        const rowAdd = await Usuario.findOne({ where: { user_id: idToAdd.id } })
        const rowRemove = await Usuario.findOne({ where: { user_id: commandUser.id } })
        
        if(commandUser.id !== idToAdd.id) {
            if(rowAdd && rowRemove) {
                const newAmountAdded = rowAdd.balance + parseInt(amountToTransfer)
                const newAmountRemoved = rowRemove.balance - parseInt(amountToTransfer)
    
                if(newAmountRemoved > 0) {
                    const adding = await Usuario.update({ balance: newAmountAdded }, { where: { user_id: idToAdd.id } })
                    const removing = await Usuario.update({ balance: newAmountRemoved }, { where: { user_id: commandUser.id } })
    
                    interaction.reply(`${amountToTransfer} coins foram tranferidos para *${rowAdd.nome}*`)
                } else {
                    interaction.reply('Você não tem coins o suficiente pra fazer a transação')
                }
            } else {
                interaction.reply('Algum desses usuários não está cadastrado')
            }
        } else {
            interaction.reply('Você não pode transferir coins pra você mesmo!')
        }
    }
}
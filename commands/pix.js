// Imports

const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')
const AuditLog = require('../models/AuditLog')

// This command is kinda cool, is used to a bot user transfer any amount of coins to another bot user

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pix')
        .setDescription('Transfere coins para um usuário')
        .addUserOption(option =>
            option.setName('id')
            .setDescription('ID do usuário que você deseja enviar coins')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('amount')
            .setDescription('Quantia a ser tranferida')
            .setRequired(true)),

// Getting the ID and the amount of coins to transfer and puting them into constants

    async execute(interaction) {
        const idToAdd = interaction.options.getUser('id')
        const amountToTransfer = interaction.options.getString('amount')
        
        // Checking if the amount is > 0, to avoid negative or 0 coins actions

        if(parseInt(amountToTransfer) > 0) {
            const commandUser = interaction.user

            // Getting both users infos

            const rowAdd = await Usuario.findOne({ where: { user_id: idToAdd.id } })
            const rowRemove = await Usuario.findOne({ where: { user_id: commandUser.id } })

            // If to avoid tranfers of a user to himself
            
            if(commandUser.id !== idToAdd.id) {
                if(rowAdd && rowRemove) {

                    // Calculating the balance of the users after the tranfer

                    const newAmountAdded = rowAdd.balance + parseInt(amountToTransfer)
                    const newAmountRemoved = rowRemove.balance - parseInt(amountToTransfer) 
        
                    // Checking if the user who gave the coins has enought coins to transfer

                    if(newAmountRemoved > 0) {

                        // Editing the balance column of both users in the DB

                        const adding = await Usuario.update({ balance: newAmountAdded }, { where: { user_id: idToAdd.id } })
                        const removing = await Usuario.update({ balance: newAmountRemoved }, { where: { user_id: commandUser.id } })

                        // Create a new register in the AuditLog table

                        const noteAudit = await AuditLog.create({
                            userSenderID: commandUser.id,
                            userSenderName: commandUser.username,
                            userReceiverID: idToAdd.id,
                            userReceiverName: idToAdd.username,
                            action: 'Transfer',
                            quantity: amountToTransfer,
                        })
        
                        interaction.reply(`${parseInt(amountToTransfer)} coins foram tranferidos para *${rowAdd.nome}*`)
                    } else {
                        interaction.reply('Você não tem coins o suficiente pra fazer a transação')
                    }
                } else {
                    interaction.reply('Algum desses usuários não está cadastrado')
                }
            } else {
                interaction.reply('Você não pode transferir coins pra você mesmo!')
            }
        } else interaction.reply('Insira um valor válido!')
    }
}
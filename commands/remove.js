// Imports

const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')
const AuditLog = require('../models/AuditLog')

// This command is used to remove coins from any user, the opposite of the 'add' command. Just me can use it

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove coins para um usuário')
        .addUserOption(option =>
            option.setName('id')
            .setDescription('ID do usuário que você deseja remover coins')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('amount')
            .setDescription('Quantia a ser removida')
            .setRequired(true)),

// Get the infos from the command options and put them into constants

    async execute(interaction) {
        const idToRemove = interaction.options.getUser('id')
        const amountToRemove = interaction.options.getString('amount')
        const commandUser = interaction.user

        // User check

        if(commandUser.id === '520994132458471438') {
            const row = await Usuario.findOne({ where: { user_id: idToRemove.id } }) // Getting the infos of the user who's gonna lose coins
            
            if(row) {

                // After checking if the user exists, just remove the coins in the balance column of the DB

                const newAmount = row.balance - parseInt(amountToRemove)

                const removing = await Usuario.update({ balance: newAmount }, { where: { user_id: idToRemove.id } }) // Removing coing in the DB

                // Create a new register in the AuditLog table
                
                const noteAudit = await AuditLog.create({
                    userSenderID: commandUser.id,
                    userSenderName: commandUser.username,
                    userReceiverID: idToRemove.id,
                    userReceiverName: idToRemove.username,
                    action: 'Remove',
                    quantity: amountToRemove,
                })

                interaction.reply(`**${amountToRemove}** coins foram removidos de *${row.nome}*`)
            }

        } else interaction.reply('Você não tem permissão pra usar esse comando')
    }
}
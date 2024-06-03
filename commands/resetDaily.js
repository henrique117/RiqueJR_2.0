// Imports (Again...)

const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')
const AuditLog = require('../models/AuditLog')

// This command is pretty simple, just reset the daily of everyone, letting them redeem it again. Just me can use it as well

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Reseta o daily'),

    async execute(interaction) {
        const commandUser = interaction.user // Getting the command user ID

        // User check

        if(commandUser.id === '520994132458471438') {    

                const dailyReset = await Usuario.update({ daily: true }, { where: { daily: false } }) // Reseting the daily in the DB

                // Create a new register in the AuditLog table
                
                const noteAudit = await AuditLog.create({
                    userSenderID: commandUser.id,
                    userSenderName: commandUser.username,
                    action: 'Reset',
                })

                interaction.reply(`Daily foi resetado com sucesso!`)

        } else interaction.reply('Você não tem permissão pra usar esse comando')
    }
}
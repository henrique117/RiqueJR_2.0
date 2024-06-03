// Imports

const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')
const AuditLog = require('../models/AuditLog')
const { where } = require('sequelize')

// This is pretty simple, just the command for the discord user connect his discord ID and name to the bot DB, with that, the user can use all the other coins commands

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Atualiza seu nome no bot'),

// Get the user info to create the table row

    async execute(interaction) {
        const target = interaction.user

        try {

            // Put the user info into the row

            const row = await Usuario.findOne({ where: { user_id: target.id } })

            if (row) { // Check if the user exists in table
                if (row.nome !== target.username) { // Checks if the user username in Discord is the same in the table

                    // Create a new register in the AuditLog table

                    const noteAudit = await AuditLog.create({
                        userSenderID: target.id,
                        userSenderName: row.nome,
                        action: 'Update',
                        quantity: target.username,
                    })

                    // Change the user nickname in the table row

                    interaction.reply(`${row.nome} teve seu usuário alterado para ${target.username}`)
                    const update = await Usuario.update({ nome: target.username }, { where: { user_id: target.id } })
                } else {
                    interaction.reply({ content: 'Seu nome já está atualizado na tabela', ephemeral: true })
                }
            } else {
                interaction.reply('Você precisa se registrar para realizar essa ação!')
            }

        } catch (error) {
            console.error(error)
            interaction.reply('Ocorreu um erro')
        }
    }
}
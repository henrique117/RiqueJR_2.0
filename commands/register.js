// Imports

const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')
const AuditLog = require('../models/AuditLog')

// This is pretty simple, just the command for the discord user connect his discord ID and name to the bot DB, with that, the user can use all the other coins commands

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Registra um novo usuário ao bot'),

// Get the user info to create the table row

    async execute(interaction) {
        const target = interaction.user

        try {

            // Put the user info into the row

            const newUser = await Usuario.create({
                user_id: target.id,
                nome: target.username,
                balance: 500, // Starter amount of coins
                daily: true,
            })

            // Create a new register in the AuditLog table

            const noteAudit = await AuditLog.create({
                userSenderID: target.id,
                userSenderName: target.username,
                action: 'Register',
            })

            interaction.reply(`Usuário *${target.username}* registrado com sucesso!`)
        } catch (error) {
            console.error(error)
            interaction.reply('Você ja cadastrou uma vez meu mano')
        }
    }
}
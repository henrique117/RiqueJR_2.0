const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Registra um novo usuário ao bot'),

    async execute(interaction) {
        const target = interaction.user

        try {
            const newUser = await Usuario.create({
                user_id: target.id,
                nome: target.username,
                balance: 500,
            })
            interaction.reply(`Usuário *${target.username}* registrado com sucesso!`)
        } catch (error) {
            console.error(error)
            interaction.reply('Você ja cadastrou uma vez meu mano')
        }
    }
}
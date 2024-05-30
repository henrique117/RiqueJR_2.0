// Imports

const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

// This command is used to delete any user from the DB using the discord ID as a key to delete, also just me can use it

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Deleta um usuário da tabela')
        .addStringOption(option =>
            option.setName('id')
            .setDescription('ID do usuário que você deseja apagar')
            .setRequired(true)),

// Getting the user ID and putting into the constant

    async execute(interaction) {
        const idToDelete = interaction.options.getString('id')
        const target = interaction.user

        // Checking user

        if(target.id === '520994132458471438') {
            const deleteRow = await Usuario.destroy({ where: { user_id: idToDelete } }) // Deleting the user from DB
            if (!deleteRow) return interaction.reply('Esse ID não existe na tabela') // Return if the user ID don't exists
            return interaction.reply('Registro deletado')
        } else interaction.reply('Você não tem permissão pra usar esse comando')
    }
}
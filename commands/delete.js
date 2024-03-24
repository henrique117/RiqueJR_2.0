const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('delete')
        .setDescription('Deleta um usuário da tabela')
        .addStringOption(option =>
            option.setName('id')
            .setDescription('ID do usuário que você deseja apagar')
            .setRequired(true)),

    async execute(interaction) {
        const idToDelete = interaction.options.getString('id')
        const target = interaction.user

        if(target.id === '520994132458471438') {
            const deleteRow = await Usuario.destroy({ where: { user_id: idToDelete } })
            if (!deleteRow) return interaction.reply('Esse ID não existe na tabela')
            return interaction.reply('Registro deletado')
        } else interaction.reply('Você não tem permissão pra usar esse comando')
    }
}
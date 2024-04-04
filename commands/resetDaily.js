const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reset')
        .setDescription('Reseta o daily'),

    async execute(interaction) {
        const commandUser = interaction.user

        if(commandUser.id === '520994132458471438') {    

                const dailyReset = await Usuario.update({ daily: true }, { where: { daily: false } })

                interaction.reply(`Daily foi resetado com sucesso!`)

        } else interaction.reply('Você não tem permissão pra usar esse comando')
    }
}
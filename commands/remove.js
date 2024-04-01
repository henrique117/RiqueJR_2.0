const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

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

    async execute(interaction) {
        const idToRemove = interaction.options.getUser('id')
        const amountToRemove = interaction.options.getString('amount')
        const commandUser = interaction.user

        if(commandUser.id === '520994132458471438') {
            const row = await Usuario.findOne({ where: { user_id: idToRemove.id } })
            
            if(row) {
                const newAmount = row.balance - parseInt(amountToRemove)

                const removing = await Usuario.update({ balance: newAmount }, { where: { user_id: idToRemove.id } })

                interaction.reply(`**${amountToRemove}** coins foram removidos de *${row.nome}*`)
            }

        } else interaction.reply('Você não tem permissão pra usar esse comando')
    }
}
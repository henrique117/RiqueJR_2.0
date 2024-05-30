// Imports

const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

// This command is used to add coins to any user by they Discord ID, just me can use it

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Adiciona coins para um usuário')
        .addUserOption(option =>
            option.setName('id')
            .setDescription('ID do usuário que você deseja adicionar coins')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('amount')
            .setDescription('Quantia a ser inserida')
            .setRequired(true)),

    async execute(interaction) {

        // Inserting the inputs values in the constants

        const idToAdd = interaction.options.getUser('id')
        const amountToAdd = interaction.options.getString('amount')
        const commandUser = interaction.user

        // User check

        if(commandUser.id === '520994132458471438') {
            const row = await Usuario.findOne({ where: { user_id: idToAdd.id } }) // Getting the user row in the DB
            
            if(row) {
                const newAmount = row.balance + parseInt(amountToAdd)

                const adding = await Usuario.update({ balance: newAmount }, { where: { user_id: idToAdd.id } }) // Editing the balance column of the user with the new value

                interaction.reply(`**${amountToAdd}** coins foram adicionados para *${row.nome}*`)
            }

        } else interaction.reply('Você não tem permissão pra usar esse comando')
    }
}
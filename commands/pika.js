const { SlashCommandBuilder } = require('discord.js')

function pika() {
    var lucky = (Math.floor(Math.random() * 25) + 5)
    var msg

    if (lucky >= 5 && lucky < 13) {
        msg = `Não se desanime com seus ${lucky}cm! Tamanho não é documento!`
    } else if (lucky >= 13 && lucky < 22) {
        msg = `Meu amigo você é policial? E esse pistolão de ${lucky}cm?`
    } else {
        msg = `Mas você vai viajar?? Acho que essa bagagem de ${lucky}cm não ta permitida!`
    }

    return msg;
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pika')
        .setDescription('nem te conto'),

    async execute(interaction) {
        await interaction.reply(pika())
    }
}
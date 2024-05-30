// Import

const { SlashCommandBuilder } = require('discord.js')

// Erm... i don't wanna talk about this one too much... Basically randomize your dick size

// Function to random and check the size and say something funny

function pika() {
    var lucky = (Math.floor(Math.random() * 25) + 5) // sorts a number between 5 and 30
    var msg

    if (lucky >= 5 && lucky < 13) {
        msg = `Não se desanime com seus ${lucky}cm! Tamanho não é documento!`
    } else if (lucky >= 13 && lucky < 22) {
        msg = `Meu amigo você é policial? E esse pistolão de ${lucky}cm?`
    } else {
        msg = `Mas você vai viajar?? Acho que essa bagagem de ${lucky}cm não ta permitida!`
    }

    return msg // Returns the 'msg' string
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pika')
        .setDescription('nem te conto'),

    async execute(interaction) {
        await interaction.reply(pika())
    }
}
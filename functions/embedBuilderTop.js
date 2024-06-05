const { EmbedBuilder } = require('discord.js')

module.exports = async (userVector) => {

    const embedString = userVector.join('\n') || 'Nenhum registro encontrado!'

    return new EmbedBuilder().setColor(0x0099FF).setTitle('TOP COINS DO BOT:').setDescription(embedString)
}
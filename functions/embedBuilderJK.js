const { EmbedBuilder } = require('discord.js')

module.exports = async (players, points) => {

    return await new EmbedBuilder()
        .setTitle(`Jokenpo\n${players[0]} x ${players[1]}`)
        .setDescription(`${points[0]} - ${points[1]}`)
        .setColor(0x0099FF)

}
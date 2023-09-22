const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const gitEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Rique JR.')
    .setURL('https://github.com/henrique117/RiqueJR_2.0')
    .setAuthor({ name: 'Henrique Assis Moreira', iconURL: 'https://i.imgur.com/g24rn9u.jpg', url: 'https://github.com/henrique117' })
    .setDescription('Esse é o meu projeto! Um Bot para Discord criado por mim, programado em JavaScript e com a biblioteca Discord.js. Atualmente estudante do curso de Ciência da Computação na UFLA')
    .setThumbnail('https://i.imgur.com/4zoexos.png')
    .setTimestamp()
    .setFields({ name: '\u200B', value: '\u200B' })
    .setFooter({ text: 'Programado em JS - Henrique Assis Moreira' });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('github')
        .setDescription('Meu código fonte atualmente! (Open source code)'),

    async execute(interaction) {
        await interaction.reply({ embeds: [gitEmbed] })
    }
}
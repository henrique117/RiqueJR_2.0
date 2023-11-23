const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const docEmbed = new EmbedBuilder()
    .setColor(0x0099FF)
    .setTitle('Vaquinha')
    .setURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
    .setDescription('Gente, esse é o HotDoc, sua história comovente comoveu muitas pessoas a ajudarem ele\n\nDoczera em sua Prime Season, era um monstro no jogo eletrônico chamado osu!. Após isso, teve seu período de decadência, tentou uma carreira como Staff e Pooler, porém sem sucesso em ambas, hoje, para a 6WC de 2024, ele precisa do máximo apoio de todos para conseguir alcançar seus objetivos e se tornar o melhor player BR toma gap... Ajudem esse idoso, ninguém quer ver ele acabando como UBER após 12 anos na faculdade...')
    .setThumbnail('https://cdn.discordapp.com/attachments/1152026544697512016/1177087749728243732/f36bd3cab8a668bf62c80bd382cf3053.png?ex=65713b64&is=655ec664&hm=05858693025560bf0e15adeaffa0d99e0f6d05224dee51fbf2ddbf081b243b22&')
    .setImage('https://pbs.twimg.com/media/F-ISDNbWgAAqKxx?format=jpg&name=360x360')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('freedozera')
        .setDescription('POR FAVOR AJUDEM!!!!'),

    async execute(interaction) {
        await interaction.reply({ embeds: [docEmbed] })
    }
}
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')

const tigrinhoEmbed = new EmbedBuilder()
    .setColor(0xFFA500)
    .setTitle('TABELA ATUALIZADA TIGRINHO 2024')
    .setThumbnail('https://i.imgur.com/XjxvI25.jpg')
    .setDescription('Probabilidade - Multiplicador\n\n35% - 0x\n20% - 1.1x\n15% - 1.2x\n10% - 1.3x\n8% - 1.4x\n6% - 1.5x\n3% - 2.0x\n1.7% - 4.0x\n0.8% - 7.0x\n0.4% - 10.0x\n 0.1% - 20.0x\n\nUse o comando **$tigrinho {valor}** e tente a sorte de ganhar alguns coins!')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tabela')
        .setDescription('Tabela do tigrinho'),

    async execute(interaction) {
        await interaction.reply({ embeds: [tigrinhoEmbed] })
    }
}
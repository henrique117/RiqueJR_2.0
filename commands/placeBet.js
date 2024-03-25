const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('placebet')
        .setDescription('Cria uma aposta')
        .addStringOption(option =>
            option.setName('title')
            .setDescription('Sobre o que é a aposta')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('time1')
            .setDescription('Sobre o que é a aposta')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('time2')
            .setDescription('Sobre o que é a aposta')
            .setRequired(true)),


    async execute(interaction) {
        const betTitle = interaction.options.getString('title')
        const betTeam1 = interaction.options.getString('time1')
        const betTeam2 = interaction.options.getString('time2')

        const betEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`**${betTitle}**`)
            .setDescription('UMA NOVA APOSTA FOI CRIADA, A APOSTA SE ENCERRA EM 3 MINUTOS')

        const closedBetEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`**${betTitle}**`)
            .setDescription('APOSTA FECHADA')

        const betButton1 = new ButtonBuilder()
            .setCustomId('betButton1')
            .setLabel(betTeam1)
            .setStyle(ButtonStyle.Primary)

        const betButton2 = new ButtonBuilder()
            .setCustomId('betButton2')
            .setLabel(betTeam2)
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder()
            .addComponents(betButton1, betButton2)

        const betModal = new ModalBuilder()
			.setCustomId('betModal')
			.setTitle('Aposta')

        const betValueInput = new TextInputBuilder()
			.setCustomId('betValueInput')
			.setLabel("Valor a ser apostado")
			.setStyle(TextInputStyle.Short);

        const actionRow = new ActionRowBuilder().addComponents(betValueInput)

        betModal.addComponents(actionRow)

        const response = await interaction.reply({ embeds: [betEmbed], components: [row] })

        const collectorFilter = i => i.user.id === interaction.user.id

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

            if(confirmation.customId === 'betButton1') {
                await confirmation.showModal(betModal)
            } else if(confirmation.customId === 'betButton2') {
                await confirmation.showModal(betModal)
            }

        } catch (error) {
            console.log(error)
            await interaction.editReply({ embeds: [closedBetEmbed] });
        }
    }
}
// Imports

const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, time, EmbedBuilder } = require('discord.js')
const embedBuilderJK = require('../functions/embedBuilderJK')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jokenpo')
        .setDescription('Jogo de jokenpo')
        .addUserOption(option =>
            option.setName('opponent')
            .setDescription('Quem vai ser o corajoso?')
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('bo')
            .setDescription('Quantas rodadas?')
            .setRequired(true)
            .addChoices(
                { name: 'Bo1', value: '1' },
                { name: 'Bo3', value: '3' },
                { name: 'Bo5', value: '4' },
                { name: 'Bo7', value: '7' },
                { name: 'Bo9', value: '9' }
            )
        ),

    async execute(interaction) {

        const commandUser = interaction.user
        const target = interaction.options.getUser('opponent')
        const bo = parseInt(interaction.options.getString('bo'))
        const time = 10_000

        const Rock = new ButtonBuilder()
            .setCustomId('rock')
            .setLabel('🪨')
            .setStyle(ButtonStyle.Primary)

        const Paper = new ButtonBuilder()
            .setCustomId('paper')
            .setLabel('📰')
            .setStyle(ButtonStyle.Primary)
        
        const Scissors = new ButtonBuilder()
            .setCustomId('scissors')
            .setLabel('✂️')
            .setStyle(ButtonStyle.Primary)

        const buttons = new ActionRowBuilder().addComponents([Rock, Paper, Scissors])

        const msg = await interaction.reply({ content: `${commandUser} está desafiando ${target}, para uma partida ${bo} de jokenpo!\nAperte :white_check_mark: para aceitar\nAperte :x: para recusar`, components: [], fetchReply: true })
        msg.react('✅').then(() => msg.react('❌'))

        const collectorFilter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === target.id
        }

        msg.awaitReactions({ filter: collectorFilter, max: 1, time: 30_000, errors: ['time'] })
            .then(async collected => {
                const reaction = collected.first()
                
                if (reaction.emoji.name === '✅') {
                    interaction.editReply(`${target} aceitou o duelo!`)

                    const players = [commandUser.username, target.username]
                    var points = [0, 0]
                    var player1choice = 0
                    var player2choice = 0
                    
                    const Embed = await embedBuilderJK(players, points)
                        msg.reactions.removeAll()
                            .then(async () => await msg.delete())

                    const message = await msg.channel.send({ embeds: [Embed.data], components: [buttons], fetchReply: true })

                    const collector = await message.createMessageComponentCollector({
                        ComponentType: ComponentType.Button,
                        time
                    });

                    var cont = 0

                    while (cont < bo) {
                        if (player1choice == 0 || player2choice == 0) {
                            collector.on('collect', async i => {
                                if (i.user.id !== target.id || i.user.id !== commandUser.id) return await i.reply({ content: 'Você não pode usar esse botão', ephemeral: true })
        
                                if(player1choice == 0) {
                                    if(i.customId == 'pedra') {
                                        player1choice = 1
                                    } else if(i.customId == 'papel') {
                                        player1choice = 2
                                    } else {
                                        player1choice = 3
                                    }
                                } else await i.reply({ content: 'Você já escolheu uma opção para essa rodada!', ephemeral: true })
        
                                if(player2choice == 0) {
                                    if(i.customId == 'pedra') {
                                        player2choice = 1
                                    } else if(i.customId == 'papel') {
                                        player2choice = 2
                                    } else {
                                        player2choice = 3
                                    }
                                } else await i.reply({ content: 'Você já escolheu uma opção para essa rodada!', ephemeral: true })
                            })
                        } else {

                            if(player1choice == player2choice) {
                                await message.channel.send('Empatou essa rodada!').then(info => setTimeout(async () => await info.delete(), 2_000))
                            } else if ((player1choice == 1 && player2choice == 3) || (player1choice == 2 && player2choice == 1) || (player1choice == 3 && player2choice == 2)) {
                                await message.channel.send(`${commandUser.username} ganhou essa rodada!`).then(info => setTimeout(async () => await info.delete(), 2_000))
                                points[0]++
                                cont++
                            } else if ((player1choice == 3 && player2choice == 1) || (player1choice == 1 && player2choice == 2) || (player1choice == 2 && player2choice == 3)) {
                                await message.channel.send(`${target.username} ganhou essa rodada!`).then(info => setTimeout(async () => await info.delete(), 2_000))
                                points[1]++
                                cont++
                            }

                            collector.on('end', async () => {
                                await message.edit({ embeds: [(await embedBuilderJK(players, points)).data] })
                            })
                        }
                    }

                } else {
                    interaction.editReply(`${target} recusou o duelo...`)
                    msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions:', error))
                }
            })
            .catch(error => {
                interaction.editReply(`${target} não respondeu o convite...`)
                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions:', error))
                console.error(error)
            })
    }      
}
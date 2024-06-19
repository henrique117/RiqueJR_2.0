// Imports

const { SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, EmbedBuilder } = require('discord.js')
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
                { name: 'Bo5', value: '5' },
                { name: 'Bo7', value: '7' },
                { name: 'Bo9', value: '9' }
            )
        ),

    async execute(interaction) {
        const commandUser = interaction.user
        const target = interaction.options.getUser('opponent')
        const bo = parseInt(interaction.options.getString('bo'))
        const requiredWins = Math.ceil(bo / 2)

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

        const msg = await interaction.reply({ content: `${commandUser} está desafiando ${target}, para uma partida Bo${bo} de jokenpo!\nAperte :white_check_mark: para aceitar\nAperte :x: para recusar`, components: [], fetchReply: true })
        await msg.react('✅')
        await msg.react('❌')

        const collectorFilter = (reaction, user) => {
            return ['✅', '❌'].includes(reaction.emoji.name) && user.id === target.id
        }

        msg.awaitReactions({ filter: collectorFilter, max: 1, time: 120_000, errors: ['time'] })
            .then(async collected => {
                const reaction = collected.first()

                if (reaction.emoji.name === '✅') {
                    await interaction.editReply(`${target} aceitou o duelo!`)

                    const players = [commandUser.username, target.username]
                    const points = [0, 0]
                    let player1choice = 0
                    let player2choice = 0

                    const Embed = await embedBuilderJK(players, points)
                    await msg.reactions.removeAll()
                    await msg.delete()

                    const message = await interaction.followUp({ embeds: [Embed.data], components: [buttons], fetchReply: true })

                    const collector = message.createMessageComponentCollector({
                        componentType: ComponentType.Button,
                        time: 60_000
                    })

                    collector.on('collect', async i => {
                        if (i.user.id !== target.id && i.user.id !== commandUser.id) {
                            return await i.reply({ content: 'Você não pode usar esse botão', ephemeral: true })
                        }

                        if (i.user.id === commandUser.id && player1choice === 0) {
                            player1choice = getChoice(i.customId)
                        } else if (i.user.id === target.id && player2choice === 0) {
                            player2choice = getChoice(i.customId)
                        } else {
                            return await i.reply({ content: 'Você já escolheu uma opção para essa rodada!', ephemeral: true })
                        }

                        if (player1choice !== 0 && player2choice !== 0) {
                            const result = determineWinner(player1choice, player2choice)
                            if (result === 0) {
                                await message.channel.send('Empatou essa rodada!').then(info => setTimeout(() => info.delete(), 2_000))
                            } else if (result === 1) {
                                points[0]++
                                await message.channel.send(`${commandUser.username} ganhou essa rodada!`).then(info => setTimeout(() => info.delete(), 2_000))
                            } else {
                                points[1]++
                                await message.channel.send(`${target.username} ganhou essa rodada!`).then(info => setTimeout(() => info.delete(), 2_000))
                            }

                            player1choice = 0
                            player2choice = 0

                            await message.edit({ embeds: [(await embedBuilderJK(players, points)).data] })

                            if (points[0] >= requiredWins || points[1] >= requiredWins) {
                                collector.stop()
                            }
                        }
                    })

                    collector.on('end', async () => {
                        await message.edit({ embeds: [(await embedBuilderJK(players, points)).data], components: [] })
                    })

                } else {
                    await interaction.editReply(`${target} recusou o duelo...`)
                    await msg.reactions.removeAll()
                }
            })
            .catch(async error => {
                await interaction.editReply(`${target} não respondeu o convite...`)
                await msg.reactions.removeAll()
                console.error(error)
            })
    }
}

function getChoice(customId) {
    if (customId === 'rock') return 1
    if (customId === 'paper') return 2
    if (customId === 'scissors') return 3
}

function determineWinner(choice1, choice2) {
    if (choice1 === choice2) return 0
    if ((choice1 === 1 && choice2 === 3) || (choice1 === 2 && choice2 === 1) || (choice1 === 3 && choice2 === 2)) return 1
    return 2
}
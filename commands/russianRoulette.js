const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rr')
        .setDescription('Russian Roulette!!!')
        .addStringOption(option =>
            option.setName('value')
                .setDescription('Valor para apostar')
                .setRequired(true)),

    async execute(interaction) {

        try {

            var betValue = Math.round(interaction.options.getString('value'))
            const firstBet = betValue
            const playerId = interaction.user.id

            const playerRow = await Usuario.findOne({ where: { user_id: playerId } })

            var bananas = [':banana:', ':banana:', ':banana:', ':banana:', ':banana:', ':banana:']

            const ContinueButton = new ButtonBuilder()
                .setCustomId('ContinueButton')
                .setLabel('Continuar')
                .setStyle(ButtonStyle.Primary)

            const CancelButton = new ButtonBuilder()
                .setCustomId('CancelButton')
                .setLabel('Cancelar')
                .setStyle(ButtonStyle.Danger)

            const rrEmbed = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`**ROLETA RUSSA**`)
                .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para começar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nEssas são suas balas, uma dessas é de verdade e vai fazer você perder o jogo e seu dinheiro... Porém quanto mais longe você for, mais dinheiro você vai ganhar!!\n\nCoins para retirada: **${Math.round(betValue)} coins**\nGanhos potenciais para a próxima rodada: **${Math.round(betValue * 1.1)} coins**`)

            const rrEmbedTimeOut = new EmbedBuilder()
                .setColor(0x0099FF)
                .setTitle(`**ROLETA RUSSA**`)
                .setDescription('Tempo esgotado! Seu dinheiro foi devolvido!')

            const row = new ActionRowBuilder()
                .addComponents(ContinueButton, CancelButton)

            if (betValue < 10) {
                interaction.reply('Aposta mínima de **10 coins**')
            } else if (playerRow.balance < betValue) {
                interaction.reply('Você não tem coins o suficiente para a aposta')
            } else {
                const response = await interaction.reply({ embeds: [rrEmbed], components: [row] })

                const balanceAfterBet = playerRow.balance - betValue
                const betting = await Usuario.update({ balance: balanceAfterBet }, { where: { user_id: playerId } })

                const collectorFilter = i => i.user.id === interaction.user.id

                var hasStoped = false
                var cont = 0

                var bullets = [0, 0, 0, 0, 0, 0]

                const trueBullet = parseInt(Math.random() * 5.5)

                // insert the true bullet

                for (let i = 0; i < 6; i++) {
                    if (i == trueBullet) {
                        bullets[i] = 1
                    }
                }

                while (!hasStoped) {
                    try {

                        const action = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 });

                        if (action.customId === 'ContinueButton') {

                            cont++
                            var bulletCheck = bullets.pop()

                            bananas.pop()

                            if (cont == 1) {
                                betValue = Math.round(betValue * 1.1)
                                const rrEmbedEdited0 = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins para retirada: **${Math.round(betValue)} coins**\nGanhos potenciais para a próxima rodada: **${Math.round(betValue * 1.25)} coins**`)
                                
                                interaction.editReply({ embeds: [rrEmbedEdited0] })
                            } else if (cont == 2) {
                                betValue = Math.round(betValue * 1.25)
                                const rrEmbedEdited1 = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins para retirada: **${Math.round(betValue)} coins**\nGanhos potenciais para a próxima rodada: **${Math.round(betValue * 1.4)} coins**`)

                                interaction.editReply({ embeds: [rrEmbedEdited1] })
                            } else if (cont == 3) {
                                betValue = Math.round(betValue * 1.4)
                                const rrEmbedEdited2 = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins para retirada: **${Math.round(betValue)} coins**\nGanhos potenciais para a próxima rodada: **${Math.round(betValue * 1.7)} coins**`)

                                interaction.editReply({ embeds: [rrEmbedEdited2] })
                            } else if (cont == 4) {
                                betValue = Math.round(betValue * 1.7)
                                const rrEmbedEdited3 = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins para retirada: **${Math.round(betValue)} coins**\nGanhos potenciais para a próxima rodada: **${Math.round(betValue * 2.2)} coins**`)

                                interaction.editReply({ embeds: [rrEmbedEdited3] })
                            } else if (cont == 5) {
                                betValue = Math.round(betValue * 2.2)
                            } else {
                                const rrEmbedError = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nOcorreu algum erro`)

                                interaction.editReply({ embeds: [rrEmbedError] })
                            }

                            if (cont > 4 || bulletCheck == 1) {

                                hasStoped = true

                                if (bulletCheck == 1) {
                                    const rrEmbedLost = new EmbedBuilder()
                                        .setColor(0x0099FF)
                                        .setTitle(`**ROLETA RUSSA**`)
                                        .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins perdidos: **${Math.round(firstBet)} coins**\n\nEra você contra a estatística e você perdeu :skull:`)

                                    interaction.editReply({ embeds: [rrEmbedLost] })
                                } else if (cont > 4) {
                                    const rrEmbedOut5 = new EmbedBuilder()
                                        .setColor(0x0099FF)
                                        .setTitle(`**ROLETA RUSSA**`)
                                        .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins ganhos: **${Math.round(betValue)} coins**\n\nVocê está com a cueca melada de tanto cagar :poop:`)

                                    interaction.editReply({ embeds: [rrEmbedOut5] })
                                    const returns = await Usuario.update({ balance: (balanceAfterBet + betValue) }, { where: { user_id: playerId } })
                                }
                            }

                        } else if (action.customId === 'CancelButton') {

                            if (cont == 0) {
                                const rrEmbedOut0 = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins devolvidos: **${Math.round(betValue)} coins**\n\nVá ao banheiro, pois até lá o corajoso caga`)

                                interaction.editReply({ embeds: [rrEmbedOut0] })
                            } else if (cont == 1) {
                                const rrEmbedOut1 = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins ganhos: **${Math.round(betValue)} coins**\n\nQuem petisca não arrisca`)

                                interaction.editReply({ embeds: [rrEmbedOut1] })
                            } else if (cont == 2) {
                                const rrEmbedOut2 = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins ganhos: **${Math.round(betValue)} coins**\n\nNunca seja a segunda opção, pois o 2 é o número da merda :poop:`)

                                interaction.editReply({ embeds: [rrEmbedOut2] })
                            } else if (cont == 3) {
                                const rrEmbedOut3 = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins ganhos: **${Math.round(betValue)} coins**\n\nSabe onde tem o número 3? Em 13, faça o L bem devagar`)

                                interaction.editReply({ embeds: [rrEmbedOut3] })
                            } else if (cont == 4) {
                                const rrEmbedOut4 = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins ganhos: **${Math.round(betValue)} coins**\n\nTerminou o jogo de 4?? To sabendo...`)

                                interaction.editReply({ embeds: [rrEmbedOut4] })
                            }

                            const returns = await Usuario.update({ balance: (balanceAfterBet + betValue) }, { where: { user_id: playerId } })

                            hasStoped = true
                        }
                    } catch (error) {
                        interaction.editReply({ embeds: [rrEmbedTimeOut] })
                        const returns = await Usuario.update({ balance: (balanceAfterBet + firstBet) }, { where: { user_id: playerId } })
                        hasStoped = true
                        console.error(error)
                    }
                }
            }
        } catch (error) {
            console.error(error)
            interaction.reply('Ops, algo deu errado')
        }
    }
}
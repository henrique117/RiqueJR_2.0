// Imports

const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')

// Ok... this one is one of my biggest projects, i'm really happy that gonne right, i'll try to comment everything for you try to understand what i was thinking
// This is a Russian Roulette bet game, consists on you bet any amount of coins and multiplying the value as long you decide to keep playing, more tries means more money, but also a higher chance to lose what you betted

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

            // Getting the inputs and user ID

            var betValue = Math.round(interaction.options.getString('value')) 
            const firstBet = betValue // Saving that for later
            const playerId = interaction.user.id

            const playerRow = await Usuario.findOne({ where: { user_id: playerId } }) // Getting the player DB infos

            var bananas = [':banana:', ':banana:', ':banana:', ':banana:', ':banana:', ':banana:'] // Create the template of the 6 bullets (Yes. They are bananas.)

            const ContinueButton = new ButtonBuilder() // Continue Button style
                .setCustomId('ContinueButton')
                .setLabel('Continuar')
                .setStyle(ButtonStyle.Primary)

            const CancelButton = new ButtonBuilder() // Cancel Button style
                .setCustomId('CancelButton')
                .setLabel('Cancelar')
                .setStyle(ButtonStyle.Danger)

            const rrEmbed = new EmbedBuilder() // First embed of the game
                .setColor(0x0099FF)
                .setTitle(`**ROLETA RUSSA**`)
                .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para começar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nEssas são suas balas, uma dessas é de verdade e vai fazer você perder o jogo e seu dinheiro... Porém quanto mais longe você for, mais dinheiro você vai ganhar!!\n\nCoins para retirada: **${Math.round(betValue)} coins**\nGanhos potenciais para a próxima rodada: **${Math.round(betValue * 1.1)} coins**`)

            const rrEmbedTimeOut = new EmbedBuilder() // Embed that shows after the timer of 60 seconds runs out
                .setColor(0x0099FF)
                .setTitle(`**ROLETA RUSSA**`)
                .setDescription('Tempo esgotado! Seu dinheiro foi devolvido!')

            const row = new ActionRowBuilder() // Building the button row
                .addComponents(ContinueButton, CancelButton)

            if (betValue < 10) { // Just cheking if the bet is higher than the minimum of 10 coins
                interaction.reply('Aposta mínima de **10 coins**')
            } else if (playerRow.balance < betValue) { // Checking if the player has enought coins to bet
                interaction.reply('Você não tem coins o suficiente para a aposta')
            } else {

                // Here things complicates a little... But nothing that hard, trust me

                const response = await interaction.reply({ embeds: [rrEmbed], components: [row] }) // Replying the interaction with the message of the first embed and the buttons

                // Betting

                const balanceAfterBet = playerRow.balance - betValue
                const betting = await Usuario.update({ balance: balanceAfterBet }, { where: { user_id: playerId } })

                const collectorFilter = i => i.user.id === interaction.user.id // Creating a filter for the interaction, just the user of the command can click the buttons

                // Creating control variables

                var hasStoped = false
                var cont = 0

                var bullets = [0, 0, 0, 0, 0, 0] // The logical vector of the bullets

                const trueBullet = parseInt(Math.random() * 5.5) // Sorting a random number to insert the real bullet in the vector position, note something, the 5.5 number is to make harder to the true bullet be the first one

                // Inserting the true bullet into the vector

                for (let i = 0; i < 6; i++) {
                    if (i == trueBullet) {
                        bullets[i] = 1
                    }
                }

                // After we prepared all the stuff, time to start the game. That while stops if somethings happens:
                // - If the user clicks the button 5 times, which means he won the game and the last bullet was the real one
                // - If he lost, which means he find the real bullet, or the number 1 in the vector
                // - If he decides to stop, clicking the 'Cancel' button
                // - If the timer of 60 seconds runs out

                while (!hasStoped) {
                    try {

                        const action = await response.awaitMessageComponent({ filter: collectorFilter, time: 60_000 }) // That's the collector of the buttons

                        if (action.customId === 'ContinueButton') { // Checking if the player pressed the 'Continue' button

                            cont++ // Increasing the counter
                            var bulletCheck = bullets.pop() // Popping the bullets of the vector and inserting the popped element in the var bulletCheck to check if it's the real one
                            bananas.pop() // Also popping of the bananas LOL


                            // Just making sure that you guys can understand the method
                            // The method works scaling your coins by multiplying the fist time and than multiplying by the odds the multiplied value, here's an example of the method with a bet of 100 coins:

                            // No shots = Return the value (100 coins)
                            // 1 shot = 1.1x of 100 (110 coins)
                            // 2 shots = 1.25x of 110 (137.5 coins = 138 coins)
                            // 3 shots = 1.4x of 138 (193.2 coins = 193 coins)
                            // 4 shots = 1.7x of 193 (328.1 coins = 328 coins)
                            // 5 shots = 2.2x of 328 (721.6 coins = 722 coins)


                            // Those if's are checking how many types the player pressed the button

                            if (cont == 1) {
                                betValue = Math.round(betValue * 1.1) // 1 time, multiply the value by 1.1x
                                const rrEmbedEdited0 = new EmbedBuilder() // That's the embed of 1 click
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins para retirada: **${Math.round(betValue)} coins**\nGanhos potenciais para a próxima rodada: **${Math.round(betValue * 1.25)} coins**`)
                                
                                interaction.editReply({ embeds: [rrEmbedEdited0] })
                            } else if (cont == 2) {
                                betValue = Math.round(betValue * 1.25) // 2 times, multiply the value by 1.25x
                                const rrEmbedEdited1 = new EmbedBuilder() // That's the embed of 2 clicks
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins para retirada: **${Math.round(betValue)} coins**\nGanhos potenciais para a próxima rodada: **${Math.round(betValue * 1.4)} coins**`)

                                interaction.editReply({ embeds: [rrEmbedEdited1] })
                            } else if (cont == 3) {
                                betValue = Math.round(betValue * 1.4) // 3 times, multiply the value by 1.4x
                                const rrEmbedEdited2 = new EmbedBuilder() // That's the embed of 3 clicks
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins para retirada: **${Math.round(betValue)} coins**\nGanhos potenciais para a próxima rodada: **${Math.round(betValue * 1.7)} coins**`)

                                interaction.editReply({ embeds: [rrEmbedEdited2] })
                            } else if (cont == 4) {
                                betValue = Math.round(betValue * 1.7) // 4 times, multiply the value by 1.7x
                                const rrEmbedEdited3 = new EmbedBuilder() // That's the embed of 4 clicks
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins para retirada: **${Math.round(betValue)} coins**\nGanhos potenciais para a próxima rodada: **${Math.round(betValue * 2.2)} coins**`)

                                interaction.editReply({ embeds: [rrEmbedEdited3] })
                            } else if (cont == 5) {
                                betValue = Math.round(betValue * 2.2) // 5 times, multiply the value by 2.2x
                            } else {
                                const rrEmbedError = new EmbedBuilder()
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nOcorreu algum erro`)

                                interaction.editReply({ embeds: [rrEmbedError] })
                            }

                            if (cont > 4 || bulletCheck == 1) { // Checking to stop the game

                                hasStoped = true // Stops the game and close the while

                                if (bulletCheck == 1) {
                                    const rrEmbedLost = new EmbedBuilder() // That's the lose embed
                                        .setColor(0x0099FF)
                                        .setTitle(`**ROLETA RUSSA**`)
                                        .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins perdidos: **${Math.round(firstBet)} coins**\n\nEra você contra a estatística e você perdeu :skull:`)

                                    interaction.editReply({ embeds: [rrEmbedLost] })
                                } else if (cont > 4) {
                                    const rrEmbedOut5 = new EmbedBuilder() // That's the embed of 5 clicks, the win embed
                                        .setColor(0x0099FF)
                                        .setTitle(`**ROLETA RUSSA**`)
                                        .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins ganhos: **${Math.round(betValue)} coins**\n\nVocê está com a cueca melada de tanto cagar :poop:`)

                                    interaction.editReply({ embeds: [rrEmbedOut5] })
                                    const returns = await Usuario.update({ balance: (balanceAfterBet + betValue) }, { where: { user_id: playerId } }) // Giving the reward for the player
                                }
                            }

                        } else if (action.customId === 'CancelButton') {

                            if (cont == 0) {
                                const rrEmbedOut0 = new EmbedBuilder() // That's the embed if the player stops at 0 clicks
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins devolvidos: **${Math.round(betValue)} coins**\n\nVá ao banheiro, pois até lá o corajoso caga`)

                                interaction.editReply({ embeds: [rrEmbedOut0] })
                            } else if (cont == 1) {
                                const rrEmbedOut1 = new EmbedBuilder() // That's the embed if the player stops at 1 click
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins ganhos: **${Math.round(betValue)} coins**\n\nQuem petisca não arrisca`)

                                interaction.editReply({ embeds: [rrEmbedOut1] })
                            } else if (cont == 2) {
                                const rrEmbedOut2 = new EmbedBuilder() // That's the embed if the player stops at 2 clicks
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins ganhos: **${Math.round(betValue)} coins**\n\nNunca seja a segunda opção, pois o 2 é o número da merda :poop:`)

                                interaction.editReply({ embeds: [rrEmbedOut2] })
                            } else if (cont == 3) {
                                const rrEmbedOut3 = new EmbedBuilder() // That's the embed if the player stops at 3 clicks
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins ganhos: **${Math.round(betValue)} coins**\n\nSabe onde tem o número 3? Em 13, faça o L bem devagar`)

                                interaction.editReply({ embeds: [rrEmbedOut3] })
                            } else if (cont == 4) {
                                const rrEmbedOut4 = new EmbedBuilder() // That's the embed if the player stops at 4 clicks
                                    .setColor(0x0099FF)
                                    .setTitle(`**ROLETA RUSSA**`)
                                    .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCoins ganhos: **${Math.round(betValue)} coins**\n\nTerminou o jogo de 4?? To sabendo...`)

                                interaction.editReply({ embeds: [rrEmbedOut4] })
                            }

                            const returns = await Usuario.update({ balance: (balanceAfterBet + betValue) }, { where: { user_id: playerId } }) // Giving the reward to the player if he stops earlier

                            hasStoped = true // Stops the game and close the while
                        }
                    } catch (error) {
                        interaction.editReply({ embeds: [rrEmbedTimeOut] }) // Shows the embed after the timer runs out
                        const returns = await Usuario.update({ balance: (balanceAfterBet + firstBet) }, { where: { user_id: playerId } }) // Return the money without the multiplier to the player
                        hasStoped = true // Stops the game and close the while
                    }
                }
            }
        } catch (error) {
            console.error(error)
            interaction.reply('Ops, algo deu errado') // Catch if something goes wrong
        }
    }
}

// That's the code of the hardest project i've been working in :)
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

        const betValue = interaction.options.getString('value')
        const playerId = interaction.user.id

        const playerRow = await Usuario.findOne({ where: { user_id: playerId } })

        var bananas = [':banana:', ':banana:', ':banana:', ':banana:', ':banana:', ':banana:']

        const ContinueButton = new ButtonBuilder()
            .setCustomId('ContinueButton')
            .setLabel('Continuar')
            .setStyle(ButtonStyle.Danger)

        const CancelButton = new ButtonBuilder()
            .setCustomId('CancelButton')
            .setLabel('Cancelar')
            .setStyle(ButtonStyle.Primary)

        const rrEmbed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`**ROLETA RUSSA**`)
            .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para começar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nEssas são suas balas, uma dessas é de verdade e vai fazer você perder o jogo e seu dinheiro... Porém quanto mais longe você for, mais dinheiro você vai ganhar!!`)

        const rrEmbedTimeOut = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`**ROLETA RUSSA**`)
            .setDescription('Tempo esgotado! Seu dinheiro foi devolvido!')

        const row = new ActionRowBuilder()
            .addComponents(ContinueButton, CancelButton)

        try {
            if(betValue < 10) {
                interaction.reply('Aposta mínima de **10 coins**')
            } else if (playerRow.balance < betValue) {
                interaction.reply('Você não tem coins o suficiente para a aposta')
            } else {
                const response = await interaction.reply({ embeds: [rrEmbed], components: [row] })

                const balanceAfterBet = playerRow.balance - betValue
                const betting = await Usuario.update({ balance: balanceAfterBet }, { where: { user_id: playerId }})

                const collectorFilter = i => i.user.id === interaction.user.id

                var hasStoped = false
                var cont = 0

                var bullets = [0, 0, 0, 0, 0, 0]

                const trueBullet = parseInt(Math.random() * 5.5)

                // insert the true bullet
                
                for (let i = 0; i < 6; i++) {
                    if(i == trueBullet) {
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

                            const rrEmbedEdited = new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle(`**ROLETA RUSSA**`)
                                .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}`)

                            const rrEmbedLost = new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle(`**ROLETA RUSSA**`)
                                .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nInfelizmente você achou a bala perdida e perdeu seu dinheiro :skull::skull:`)
                    
                            const rrEmbedOut5 = new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle(`**ROLETA RUSSA**`)
                                .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nSimplesmente foi contra tudo e todos! Você foi o único que descobriu a bala verdadeira sem morrer no caminho... 20x para você amigo, farmou **${betValue * 20} coins**!`)
                    

                            interaction.editReply({ embeds: [rrEmbedEdited] })

                            if (cont > 4 || bulletCheck == 1) {

                                hasStoped = true

                                if (bulletCheck == 1) {
                                    interaction.editReply({ embeds: [rrEmbedLost] })
                                } else if (cont > 4) {
                                    interaction.editReply({ embeds: [rrEmbedOut5] })
                                    const returns = await Usuario.update({ balance: (balanceAfterBet + (betValue * 20)) }, { where: { user_id: playerId }})
                                }
                            }

                        } else if (action.customId === 'CancelButton') {

                            const rrEmbedOut0 = new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle(`**ROLETA RUSSA**`)
                                .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCovarde... Nem tentou o desafio... Seu dinheiro da aposta foi devolvido!`)

                            const rrEmbedOut1 = new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle(`**ROLETA RUSSA**`)
                                .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nTranquilo, saiu com 1.1x humilde... ganhou **${betValue * 1.1} coins**!`)
                    
                            const rrEmbedOut2 = new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle(`**ROLETA RUSSA**`)
                                .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nCorajoso até, foi um pouco mais longe com 1.4x e ganhou **${betValue * 1.4} coins**!!`)
                    
                            const rrEmbedOut3 = new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle(`**ROLETA RUSSA**`)
                                .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nVocê não tem medo?? Mas boa, chegou aqui com 2x e ganhou **${betValue * 2} coins**!!`)
                    
                            const rrEmbedOut4 = new EmbedBuilder()
                                .setColor(0x0099FF)
                                .setTitle(`**ROLETA RUSSA**`)
                                .setDescription(`Roleta Russa dos crias! Clique no botão **Continuar** para continuar o jogo, ou no de **Cancelar** para cancelar o jogo e retornar sua aposta!\n\n${bananas}\n\nChegando tão perto da sorte você desistiu... ou será que do fracasso? Não saberemos nunca. 7x pra você, ganhou **${betValue * 7} coins**!`)
                    
                            if (cont == 0) {
                                interaction.editReply({ embeds: [rrEmbedOut0] })
                                const returns = await Usuario.update({ balance: (balanceAfterBet + (betValue * 1)) }, { where: { user_id: playerId }})
                            } else if (cont == 1) {
                                interaction.editReply({ embeds: [rrEmbedOut1] })
                                const returns = await Usuario.update({ balance: (balanceAfterBet + (betValue * 1.1)) }, { where: { user_id: playerId }})
                            } else if (cont == 2) {
                                interaction.editReply({ embeds: [rrEmbedOut2] })
                                const returns = await Usuario.update({ balance: (balanceAfterBet + (betValue * 1.3)) }, { where: { user_id: playerId }})
                            } else if (cont == 3) {
                                interaction.editReply({ embeds: [rrEmbedOut3] })
                                const returns = await Usuario.update({ balance: (balanceAfterBet + (betValue * 2)) }, { where: { user_id: playerId }})
                            } else if (cont == 4) {
                                interaction.editReply({ embeds: [rrEmbedOut4] })
                                const returns = await Usuario.update({ balance: (balanceAfterBet + (betValue * 7)) }, { where: { user_id: playerId }})
                            }
                            hasStoped = true
                        }
                    } catch (error) {
                        interaction.editReply({ embeds: [rrEmbedTimeOut] })
                        const returns = await Usuario.update({ balance: (balanceAfterBet + (betValue * 1)) }, { where: { user_id: playerId }})
                        hasStoped = true
                    }
                }
            }
        } catch (error) {
            console.error(error)
            interaction.reply('Ops, algo deu errado')
        }
    }
}
// Imports

const { SlashCommandBuilder } = require('discord.js')
const Usuario = require('../models/Usuario')
const pagination = require('../functions/pagination')
const embedBuilderTop = require('../functions/embedBuilderTop')

// Since we got 44 users in the bot!!! I'll have to change this one in the next patch, I'll comment that later, but for now it shows a list of all the players in the bot

module.exports = {
    data: new SlashCommandBuilder()
        .setName('top')
        .setDescription('Mostra os usuarios cadastrados'),

    async execute(interaction) {

        const userList = await Usuario.findAll({ 
            attributes: ['nome', 'balance'],
            order: [['balance', 'DESC']]
        })

        var userVector = []
        var placement = 1

        userList.forEach(u => {
            userVector.push(`${placement}- ${u.nome} - ${u.balance}`)
            placement++
        });

        const pages = parseInt((userVector.length / 10) + 1)
        const lastPage = userVector.length % 10

        var cont = 0

        var pagesVector = []
        var embedVector = []
        
        for(let i = 0; i < pages; i++) {
            if (i == pages - 1) {
                for (let j = 0; j < 10 - lastPage; j++) {
                    embedVector.pop()
                }
                for (let j = 0; j < lastPage; j++) {
                    embedVector[j] = userVector[cont]
                    cont++
                }
            } else {
                for(let j = 0; j < 10; j++) {
                    embedVector[j] = userVector[cont]
                    cont++
                }
            }

            pagesVector.push(await embedBuilderTop(embedVector))

        }

        await pagination(interaction, pagesVector)

    }
}
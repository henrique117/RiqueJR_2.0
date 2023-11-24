const { SlashCommandBuilder } = require('discord.js')

/* const dotenv = require('dotenv')
dotenv.config()
const { P1, P2 } = process.env */

const P1 = 7
const P2 = 5
const Inv = 7

const n = P1*P2

function descriptografar(x) {
    return (Math.pow(x, Inv) % n)
}

function converter(x) {
    switch (x) {
        case 10:
            return 'A'
        case 11:
            return 'B'
        case 12:
            return 'C'
        case 13:
            return 'D'
        case 14:
            return 'E'
        case 15:
            return 'F'
        case 16:
            return 'G'
        case 17:
            return 'H'
        case 18:
            return 'I'
        case 19:
            return 'J'
        case 20:
            return 'K'
        case 21:
            return 'L'
        case 22:
            return 'M'
        case 23:
            return 'N'
        case 24:
            return 'O'
        case 25:
            return 'P'
        case 26:
            return 'Q'
        case 27:
            return 'R'
        case 28:
            return 'S'
        case 29:
            return 'T'
        case 30:
            return 'U'
        case 31:
            return 'V'
        case 32:
            return 'W'
        case 33:
            return 'X'
        case 34:
            return 'Y'
        case 35:
            return 'Z'
    }
}

function descript (code) {

    const codigo = code;

    const blocos = codigo.split('-')

    const blocosDescrip = [descriptografar(parseInt(blocos[0])), descriptografar(parseInt(blocos[1])), descriptografar(parseInt(blocos[2]))]
    const letrasConv = [converter(blocosDescrip[0]), converter(blocosDescrip[1]), converter(blocosDescrip[2])]

    return(`A palavra é ${letrasConv[0]}${letrasConv[1]}${letrasConv[2]}`)
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('descriptografar')
        .setDescription('Descriptografa 3 letras com RSA')
        .addStringOption(option =>
            option.setName('input')
            .setDescription('Insira o código separando o bloco por "-" para decodificá-las')
            .setRequired(true)),

    async execute(interaction) {
        const code = interaction.options.getString('input')

        if(code.split("-").length != 3) {
            await interaction.reply('O código deve conter 3 blocos! Perdão ainda não fiz com mais letras kk')
        } else {
            await interaction.reply(descript(code))
        }

    }
}
const { SlashCommandBuilder } = require('discord.js')

/* const dotenv = require('dotenv')
dotenv.config()
const { P1, P2 } = process.env */

const P1 = 7
const P2 = 5

const n = P1*P2

function criptografar(x) {
    return ((Math.pow(x, P1)) % n)
}

function converter(x) {
    switch (x) {
        case 'A':
            return 10;
        case 'B':
            return 11;
        case 'C':
            return 12;
        case 'D':
            return 13;
        case 'E':
            return 14;
        case 'F':
            return 15;
        case 'G':
            return 16;
        case 'H':
            return 17;
        case 'I':
            return 18;
        case 'J':
            return 19;
        case 'K':
            return 20;
        case 'L':
            return 21;
        case 'M':
            return 22;
        case 'N':
            return 23;
        case 'O':
            return 24;
        case 'P':
            return 25;
        case 'Q':
            return 26;
        case 'R':
            return 27;
        case 'S':
            return 28;
        case 'T':
            return 29;
        case 'U':
            return 30;
        case 'V':
            return 31;
        case 'W':
            return 32;
        case 'X':
            return 33;
        case 'Y':
            return 34;
        case 'Z':
            return 35;
        default:
            return console.log('conversao nao foi realizada pois a letra é inexistente.');
    }
}

// Usar apenas Letras maiúsculas

function cript (word) {
    const palavra = word

    const letras = [palavra.charAt(0).toUpperCase(), palavra.charAt(1).toUpperCase(), palavra.charAt(2).toUpperCase()];
    const letrasConvertidas = [converter(letras[0]), converter(letras[1]), converter(letras[2])]

    const letrasCrip = [criptografar(letrasConvertidas[0]), criptografar(letrasConvertidas[1]), criptografar(letrasConvertidas[2])]

    return (`${letrasCrip[0]}-${letrasCrip[1]}-${letrasCrip[2]}`)
}



module.exports = {
    data: new SlashCommandBuilder()
        .setName('criptografar')
        .setDescription('Criptografa 3 letras com RSA')
        .addStringOption(option =>
            option.setName('input')
            .setDescription('Insira 3 letras para codificá-las')
            .setRequired(true)),

    async execute(interaction) {
        const palavra = interaction.options.getString('input')

        if(palavra.split("").length != 3) {
            await interaction.reply('A palavra deve conter 3 letras! Perdão ainda não fiz com mais letras kk')
        } else {
            await interaction.reply(cript(palavra))
        }
    }
}
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')
const database = require('./db/dbConection')
const Usuario = require('./models/Usuario')
const prefix = '$'
var resetado = false

// dotenv
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID, GUILD_ID } = process.env

// Commands Import
const fs = require('node:fs')
const path = require('node:path');
const internal = require('node:stream');
const { stringify } = require('node:querystring')

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ]
});

client.commands = new Collection()

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file)
    const command = require(filePath)

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command)
    } else {
        console.log(`Esse comando em ${filePath} esta sem data ou execute`)
    }
}

client.once(Events.ClientReady, c => {
    database.sync()
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async c => {
    if(c.author.bot === false && c.content === 'o/') {
        c.reply('o/')
    }
    if(c.author.bot !== true) {
        const Data = new Date()
        const hora = Data.getHours()
        if ((hora === 21 || hora === 9) && resetado === false) {
            const dailyReset = await Usuario.update({ daily: true }, { where: { daily: false } })
            resetado = true
        }

        if (hora !== 21 && hora !== 9) {
            resetado = false
        }
    }
})

client.on('messageCreate', async (message) => {
    if (message.content.toLocaleLowerCase() === prefix + 'daily' && message.author.bot !== true) {
        try {
            const user = message.author.id
            const row = await Usuario.findOne({ where: { user_id: user } })
            if (row.daily) {
                const updatingDaily = await Usuario.update({ daily: false }, { where: { user_id: user } })
                const adding = await Usuario.update({ balance: row.balance + 200 }, { where: { user_id: user } })

                message.reply('Você recebeu **200 coins!**, volte novamente mais tarde para pegar o próximo bônus!')
            } else {
                message.reply('Você já resgatou sua recompensa do dia!')
            }
        } catch (error) {
            console.error(error)
            message.reply('Você precisa se registrar para realizar essa ação! Se registre usando **/register**')
        }
    }
})

// var tries = 0

client.on('messageCreate', async (message) => {

    /* function findOut() {
        const random = Math.random() * 100
        tries++
        if (random <= 100 && random >= 99.9){
            message.reply(`Gastei ${tries} rolls para acertar o 20x`)
            tries = 0
        } else findOut()
    }

    if(message.content === (prefix + 'teste')) {
        findOut()
    } */

    if (message.content.toLocaleLowerCase().startsWith(prefix + 'tigrinho') && message.author.bot !== true) {
        try {
            const randomNum = Math.random() * 100
            const whichValue = message.content.split(' ')

            try {
                const bet = parseInt(whichValue[1])
                if(bet < 10) {
                    message.reply('Aposta mínima de **10 coins**')
                    return
                }
                if(bet > 0) {
                    const user = message.author.id
                    const row = await Usuario.findOne({ where: { user_id: user } })

                    if (row.balance - bet >= 0) {
                        const betting = await Usuario.update({ balance: row.balance - bet }, { where: { user_id: user } })
                        const newRowBalance = await Usuario.findOne({ where: { user_id: user } })

                        if (randomNum < 35) {
                            message.reply('Vish ce sifudeu e perdeu tudo')
                        } else if (randomNum < 55 && randomNum >= 35) {
                            const adding = await Usuario.update({ balance: newRowBalance.balance + bet * 1.1 }, { where: { user_id: user } })
                            message.reply(`Nice mlk, ganhou **${parseInt(bet * 1.1)} coins**, 1.1x suave`)
                        } else if (randomNum < 70 && randomNum >= 55) {
                            const adding = await Usuario.update({ balance: newRowBalance.balance + bet * 1.2 }, { where: { user_id: user } })
                            message.reply(`Boa demais, ganhou **${parseInt(bet * 1.2)} coins**, 1.2x já é melhorzinho`)
                        } else if (randomNum < 80 && randomNum >= 70) {
                            const adding = await Usuario.update({ balance: newRowBalance.balance + bet * 1.3 }, { where: { user_id: user } })
                            message.reply(`Tá melhorando, ganhou **${parseInt(bet * 1.3)} coins**, 1.3x maneiro`)
                        } else if (randomNum < 88 && randomNum >= 80) {
                            const adding = await Usuario.update({ balance: newRowBalance.balance + bet * 1.4 }, { where: { user_id: user } })
                            message.reply(`Aqui já fica legal, ganhou **${parseInt(bet * 1.4)} coins**, 1.4x insano`)
                        } else if (randomNum < 94 && randomNum >= 88) {
                            const adding = await Usuario.update({ balance: newRowBalance.balance + bet * 1.5 }, { where: { user_id: user } })
                            message.reply(`Forte demais, ganhou **${parseInt(bet * 1.5)} coins**, 1.5x pra vc`)
                        } else if (randomNum < 97 && randomNum >= 94) {
                            const adding = await Usuario.update({ balance: newRowBalance.balance + bet * 2 }, { where: { user_id: user } })
                            message.reply(`Dobrou sua aposta, ganhou **${parseInt(bet * 2)} coins**, 2x doados pra vc!`)
                        } else if (randomNum < 98.7 && randomNum >= 97) {
                            const adding = await Usuario.update({ balance: newRowBalance.balance + bet * 4 }, { where: { user_id: user } })
                            message.reply(`Aqui vc ja tá com a sorte em dia, ganhou **${parseInt(bet * 4)} coins**, 4x pra tu!`)
                        } else if (randomNum < 99.5 && randomNum >= 98.7) {
                            const adding = await Usuario.update({ balance: newRowBalance.balance + bet * 7 }, { where: { user_id: user } })
                            message.reply(`NÚMERO DA SORTE PRA ALGUÉM SORTUDO! Ganhou **${parseInt(bet * 7)} coins**, 7x a sua aposta!`)
                        } else if (randomNum < 99.9 && randomNum >= 99.5) {
                            const adding = await Usuario.update({ balance: newRowBalance.balance + bet * 10 }, { where: { user_id: user } })
                            message.reply(`VC É A PESSOA MAIS SORTUDA DO MUNDO!! Ganhou **${parseInt(bet * 10)} coins**, 10x o que vc apostou!!!`)
                        } else if (randomNum <= 100 && randomNum >= 99.9) {
                            const adding = await Usuario.update({ balance: newRowBalance.balance + bet * 20 }, { where: { user_id: user } })
                            message.reply(`VC SIMPLESMENTE ZEROU O TIGRINHO!!!! :tiger::tiger2: Gahou **${parseInt(bet * 20)} coins**, **20X** PRA VC AMIGÃO, PARABÉNS!!`)
                        }
                    } else {
                        message.reply('Você não tem coins o suficiente para fazer a aposta!')
                    }
                } else {
                    message.reply('Digite um valor válido para a aposta')
                }
            } catch (error) {
                console.error(error)
                message.reply('Digite um valor válido para a aposta')
            }
        } catch (error) {
            console.error(error)
            message.reply('Você precisa se registrar para realizar essa ação!')
        }
    }
})

client.login(TOKEN);

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return
    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) {
        console.error('Comando não encontrado!')
        return
    }

    try {
        await command.execute(interaction)
    } catch (error) {
        console.error(error)
        await interaction.reply('Não consegui rodar esse comando!')
    }
})
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js') // Imports from Discord.js
const database = require('./db/dbConnection') // My DB conection
const Usuario = require('./models/Usuario') // DB models imports
const AuditLog = require('./models/AuditLog')
const prefix = '$' // The prefix used in the commands
var resetado = false // To check daily

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

// Organizing the Discord client intents

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ]
});

// Importing the SlashCommands of the bot

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

// Show on the console the bot Logging in

client.once(Events.ClientReady, c => {
    database.sync()
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

// Message capture event

client.on(Events.MessageCreate, async c => {

    // Simple command to reply every 'o/' with another 'o/'

    if(c.author.bot === false && c.content === 'o/') {
        c.reply('o/')
    }

    // This one check the hour in each message sent on the channels

    if(c.author.bot !== true) {
        const Data = new Date()
        const hora = Data.getHours()

        // If the time is 9am or 9pm, the command '$daily' is reseted and you can redeem it again

        if ((hora === 21 || hora === 9) && resetado === false) {
            const dailyReset = await Usuario.update({ daily: true }, { where: { daily: false } })
            resetado = true // Just to reset once
        }

        if (hora !== 21 && hora !== 9) {
            resetado = false // If it's not 9am or 9pm the variable 'resetado' turns false again to reset again later
        }
    }
})

// The daily command itself, used to give a bonus of 200 coins every 12 hours for anyone who redeems it

client.on('messageCreate', async (message) => {

    // Check the message content and if it's not a bot sending it

    if (message.content.toLocaleLowerCase() === prefix + 'daily' && message.author.bot !== true) {
        try {
            const user = message.author.id
            const row = await Usuario.findOne({ where: { user_id: user } }) // Getting the user info on the DB

            // Check if the 'daily' is avaible to the user

            if (row.daily) {

                // Giving the 200 bonus to the user and changing the daily check to false

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

// The famous command in the bot, just some betting stuff called 'Tigrinho' that you can spend your coins trying to get lucky and be the richest user in the list

client.on('messageCreate', async (message) => {

    // That commented function down here is just a simple test that i used to figure out how many times average you have to use the '$tigrinho' command to get the biggest award

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

    // Checking the message to start the command and if the message author isn't a bot

    if (message.content.toLocaleLowerCase().startsWith(prefix + 'tigrinho') && message.author.bot !== true) {
        try {
            const randomNum = Math.random() * 100 // Sorting a real number between 1 and 100
            const whichValue = message.content.split(' ') // Spliting the message in 2 parts to get the value of the bet

            try {
                const bet = parseInt(whichValue[1]) // Putting the bet value into the const 'bet'

                // Checking if the bet is higher than the minimum amount of the bet, which is 10
                
                if(bet < 10) {
                    message.reply('Aposta mínima de **10 coins**')
                    return
                }

                if(bet > 0) { // Useless if my bad

                    // Getting the user infos of the DB

                    const user = message.author.id
                    const row = await Usuario.findOne({ where: { user_id: user } })

                    // Checking if the user has the bet value in his balance to bet

                    if (row.balance - bet >= 0) {

                        // Removing the coins of the bet from the wallet

                        const betting = await Usuario.update({ balance: row.balance - bet }, { where: { user_id: user } })
                        const newRowBalance = await Usuario.findOne({ where: { user_id: user } })

                        // That entire block of code is to check the random number generated before and giving the user the bounties of the bet

                        if (randomNum < 35) {
                            message.reply('Vish ce sifudeu e perdeu tudo') // That's the only case which the user lost all the coins he betted
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

// Make the bot login in the Discord server with the bot token

client.login(TOKEN);

// Catching the SlashCommands used by the user

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
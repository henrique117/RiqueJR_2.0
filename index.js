const { Client, Events, GatewayIntentBits, Collection } = require('discord.js')
const database = require('./db/dbConection')
const Usuario = require('./models/Usuario')
const prefix = '$'
const Data = new Date()
var resetado = true

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

const client = new Client({ intents: [
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

client.on(Events.ClientReady, async c => {
    const hora = Data.getHours()
    if(hora === 21 && resetado === false){
        const adding = await Usuario.update({ daily: true }, { where: { daily: false } })
        resetado = true
    }
    
    if(hora !== 21) {
        resetado = false
    }
})

client.on('messageCreate', async (message) => {
    if(message.content === prefix + 'daily') {
        try {
            const user = message.author.id
            const row = await Usuario.findOne({ where: { user_id: user } })
            if(row.daily) {
                const updatingDaily = await Usuario.update({ daily: false }, { where: { user_id: user } })
                const adding = await Usuario.update({ balance: row.balance + 50 }, { where: { user_id: user } })

                message.reply('Você recebeu **50** coins diários! Volte novamente no dia seguinte para resgatar de novo')
            } else {
                message.reply('Você já resgatou sua recompensa do dia!')
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
const { REST, Routes } = require('discord.js')

// dotenv
const dotenv = require('dotenv')
dotenv.config()
const { TOKEN, CLIENT_ID } = process.env

// Commands Import
const fs = require('node:fs')
const path = require('node:path');
const internal = require('node:stream');

const commandsPath = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))

const commands = []

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    commands.push(command.data.toJSON())
}

// Instancia REST
const rest = new REST({version: 10}).setToken(TOKEN);

// Deploy
(async () => {
    try {
        console.log(`Resetando ${commands.length} comandos...`)

        // PUT
        const data = await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            {body: commands}
        )

        console.log('Comandos carregados com sucesso!')
    } catch (error) {
        console.error(error)
    }
})()
const config = require('../config.json');
const { Client, GatewayIntentBits } = require('discord.js');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const { spawn } = require("child_process");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ]
});

const deployProcess = spawn("node", ["deploy-commands.js"]);

deployProcess.stdout.on("data", data => console.log(`[슬래시 등록] ${data}`));
deployProcess.stderr.on("data", data => console.error(`[슬래시 등록 오류] ${data}`));

loadCommands(client);
loadEvents(client);

client.login(config.token);
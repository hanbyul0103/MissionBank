const fs = require("fs");
const path = require("path");

function loadCommands(client) {
    client.commands = new Map();
    const commandsPath = path.join(__dirname, "../commands");

    fs.readdirSync(commandsPath).forEach(category => {
        const categoryPath = path.join(commandsPath, category);
        if (!fs.lstatSync(categoryPath).isDirectory()) return;

        fs.readdirSync(categoryPath).forEach(file => {
            if (!file.endsWith(".js")) return;
            const command = require(`${categoryPath}/${file}`);
            client.commands.set(command.data.name, command);
        });
    });

    console.log(`[handler] ${client.commands.size}개의 명령어가 로드됨`);
}

module.exports = { loadCommands };
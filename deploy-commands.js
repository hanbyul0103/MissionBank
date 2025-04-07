const { REST, Routes } = require("discord.js");
const config = require("./config.json");
const fs = require("fs");
const path = require("path");

const commands = [];
const commandsPath = path.join(__dirname, "src/commands");

fs.readdirSync(commandsPath).forEach(category => {
    const categoryPath = path.join(commandsPath, category);
    if (!fs.lstatSync(categoryPath).isDirectory()) return;

    fs.readdirSync(categoryPath).forEach(file => {
        if (!file.endsWith(".js")) return;
        const command = require(`${categoryPath}/${file}`);

        if (command.data) {
            commands.push(command.data.toJSON());
        } else {
            console.warn(`[⚠️] ${file}에서 'data'가 정의되지 않음.`);
        }
    });
});

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
    try {
        console.log(`[⌛] ${commands.length}개의 슬래시 커맨드를 등록하는 중...`);
        
        await rest.put(
            Routes.applicationCommands(config.clientId), // 전체 등록
            { body: commands }
        );

        console.log(`[✅] 슬래시 커맨드가 성공적으로 등록됨!`);
    } catch (error) {
        console.error(`[❌] 슬래시 커맨드 등록 실패`, error);
    }
})();

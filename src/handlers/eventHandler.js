const fs = require("fs");
const path = require("path");

function loadEvents(client) {
    const eventsPath = path.join(__dirname, "../events");

    fs.readdirSync(eventsPath).forEach(file => {
        if (!file.endsWith(".js")) return;
        const event = require(`${eventsPath}/${file}`);
        client.on(event.name, (...args) => event.execute(...args, client));
    });

    console.log(`[handler] 이벤트 핸들러 로드 완료`);
}

module.exports = { loadEvents };
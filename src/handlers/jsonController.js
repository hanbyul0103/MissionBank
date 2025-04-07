const fs = require("fs").promises;

const jsonController = {
    // 데이터 읽기 (비동기)
    async readData(filePath) {
        try {
            const data = await fs.readFile(filePath, "utf8");
            return JSON.parse(data);
        } catch (error) {
            if (error.code === "ENOENT") {
                // 파일이 없으면 빈 객체 반환 (초기화)
                return {};
            }
            console.error("JSON 읽기 오류:", error);
            throw error;
        }
    },

    // 데이터 저장 (비동기)
    async saveData(filePath, data) {
        try {
            await fs.writeFile(filePath, JSON.stringify(data, null, 4), "utf8");
        } catch (error) {
            console.error("JSON 저장 오류:", error);
            throw error;
        }
    },
};

module.exports = jsonController;
const config = require("../../config.json");
const mysql = require("mysql2/promise");

// (async function () {
//     const conn = await mysql.createPool(config.mysql);

//     connection = conn;
//     console.log("MySQL 연결 성공!");

//     const conn2 = await conn.getConnection();
//     conn2.query
//     conn2.release();
// })();

const pool = mysql.createPool(config.mysql);
module.exports = pool;
const { DateTime } = require("luxon");
const config = require("../../config.json");
const mysql = require("mysql2/promise");

let connection

(async function () {
    const conn = await mysql.createConnection(config.mysql);
    await conn.connect();

    connection = conn;
    console.log("MySQL 연결 성공!");
})();

// 계정 만들기
async function createAccount(clientId, userName, currentTime) {
    try {
        await connection.query(
            "INSERT INTO userTable (id, name, point, createAt) VALUES (?, ?, ?, ?)",
            [clientId, userName, 0, currentTime]);

        console.log("createAccount success!");
        return { success: true, message: "계정이 성공적으로 생성되었습니다!" };
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
            console.log("createAccount failed", err);
            return { success: false, message: "이미 가입된 계정입니다." };
        } else {
            console.log("createAccount failed", err);
            return { success: false, message: "가입에 실패했습니다." };
        }
    };
}

// 계정 가져오기
async function getAccount(clientId) {
    try {
        const [results] = await connection.query(
            "SELECT * FROM userTable WHERE id = ?",
            [clientId]
        );

        if (results.length === 0) {
            return { success: false, message: "가입된 계정이 없습니다." };
        }

        console.log("getAccount success!", results[0]);
        return { success: true, message: "계정 조회 성공!", data: results[0] };
    } catch (err) {
        console.error("getAccount failed", err);
        return { success: false, message: "계정 조회에 실패했습니다." };
    }
}

// 계정 삭제
async function deleteAccount(clientId) {
    try {
        const [results] = await connection.query(
            "DELETE FROM userTable WHERE id = ?",
            [clientId]
        );

        if (results.affectedRows === 0) {
            return { success: false, message: "가입된 계정이 없습니다." };
        }

        const [attendanceDeleteResult] = await connection.query(
            "SELECT * FROM attendanceTable WHERE id = ?",
            [clientId]
        );

        if (attendanceDeleteResult.length === 0) {
            return { success: true, message: "출석체크 내역이 없습니다." };
        } else {
            const [attendanceResult] = await connection.query(
                "DELETE FROM attendanceTable WHERE id = ?",
                [clientId]
            );

            if (attendanceResult.affectedRows === 0) {
                return { success: false, message: "출석체크 내역 삭제에 실패했습니다." };
            }
            else {
                return { success: true, message: "출석체크 내역 삭제에 성공했습니다." };
            }
        }
    } catch (err) {
        console.error("deleteAccount failed", err);
        return { success: false, message: "최종 계정 삭제에 실패했습니다." };
    }
}

// 출석체크
async function getAttendanceData(clientId) {
    try {
        const now = DateTime.now().setZone("Asia/Seoul");
        const today = now.toFormat("yyyy-MM-dd");

        const [attendanceResults] = await connection.query(
            "SELECT * FROM attendanceTable WHERE id = ?",
            [clientId]);

        if (attendanceResults.length === 0) {
            const [results] = await connection.query(
                "INSERT INTO attendanceTable (id, done) VALUES (?, ?)",
                [clientId, now.toFormat("yyyy-MM-dd")]
            );

            if (results.affectedRows > 0) {
                return { success: true, message: "출석체크 성공!" };
            } else {
                return { success: false, message: "출석체크에 실패했습니다." };
            }
        } else {
            const lastAttendance = attendanceResults[0].done;
            const date = new Date(lastAttendance);
            const lastAttendanceDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

            if (lastAttendanceDate === today) {
                return { success: false, message: "이미 출석체크를 완료했습니다." };
            } else {
                const [results] = await connection.query(
                    "UPDATE attendanceTable SET done = ? WHERE id = ?",
                    [now.toFormat("yyyy-MM-dd"), clientId]
                );

                if (results.affectedRows > 0) {
                    return { success: true, message: "출석체크 성공!" };
                } else {
                    return { success: false, message: "출석체크에 실패했습니다." };
                }
            }
        }
    } catch (err) {
        console.error("attendanceCheck failed", err);
        return { success: false, message: "출석체크에 실패했습니다." };
    }
}

// 포인트 지급
async function givePoint(clientId, amount) {
    try {
        const [getResults] = await connection.query(
            "SELECT point FROM userTable WHERE id = ?",
            [clientId]
        );

        if (getResults.length === 0) {
            console.log("givePoint failed");
            return { success: false, message: "계정 조회에 실패했습니다." };
        }

        const originalPoint = getResults[0];

        const [results] = await connection.query(
            "UPDATE userTable SET point = ? WHERE id = ?",
            [originalPoint.point + amount, clientId]
        );

        if (results.affectedRows > 0) {
            return { success: true, message: "성공" }
        } else {
            return { success: false, message: "실패" };
        }
    } catch (err) {
        console.log("givePoint failed", err);
    }
}

// 포인트 차감
async function takePoint(clientId, amount) {
    try {
        const [getResults] = await connection.query(
            "SELECT point FROM userTable WHERE id = ?",
            [clientId]
        );

        if (getResults.length === 0) {
            console.log("takePoint failed");
            return { success: false, message: "계정 조회에 실패했습니다." };
        }

        const originalPoint = getResults[0];

        const [results] = await connection.query(
            "UPDATE userTable SET point = ? WHERE id = ?",
            [Math.max(originalPoint.point - amount, 0), clientId]
        );

        if (results.affectedRows > 0) {
            return { success: true, message: "성공" }
        } else {
            return { success: false, message: "실패" };
        }
    } catch (err) {
        console.log("takePoint failed", err);
    }
}

module.exports = { createAccount, getAccount, deleteAccount, getAttendanceData, givePoint, takePoint };
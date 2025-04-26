const { Player, Mafia, Citizen, Police, Doctor } = require("./mafiaRoles");
const { assignRoles } = require("./mafiaRule");

const gameState = {
    wait: "waiting",
    go: "ongoing",
    end: "ending"
}

const time = {
    day: "낮이 되었습니다.",
    night: "밤이 되었습니다."
}

const roleCountsByPlayer = {
    4: { mafia: 1, citizen: 1, police: 1, doctor: 1 },
    5: { mafia: 1, citizen: 2, police: 1, doctor: 1 },
    6: { mafia: 2, citizen: 2, police: 1, doctor: 1 },
    7: { mafia: 2, citizen: 3, police: 1, doctor: 1 },
    8: { mafia: 3, citizen: 4, police: 1, doctor: 1 },
};

class MafiaGameManager {
    constructor() {
        this.rooms = new Map();
        this.users = new Map();
        this.allRooms = 0;
        this.allPlayers = 0;
    }

    createRoom(id) {
        const newRoom = new Room(id);

        this.rooms.set(id, newRoom);
        this.allRooms += 1;

        return newRoom;
    }

    deleteRoom(id) {
        const room = this.getRoom(id);

        if (room) {
            for (const userId of room.players.keys()) {
                this.users.delete(userId);
            }
        }

        this.rooms.delete(room);
    }

    getRoom(id) {
        return this.rooms.get(id);
    }

    isUserInGame(userId) {
        return this.users.has(userId);
    }

    addPlayerToRoom(user, room) {
        const room = this.getRoom(room.id);
        if (!room) return { message: "방을 찾을 수 없습니다.", success: false };

        const added = room.addPlayer(user);
        if (added) {
            this.users.set(user.id, room);
            this.allPlayers += 1;
        }

        return true;
    }

    removePlayerFromRoom(user) {
        const roomId = this.users.get(user.id);
        const room = this.getRoom(roomId);

        if (room) {
            room.removePlayer({ id: user.id });
        }

        this.users.delete(user.id);
    }
}

class Room {
    constructor(id) {
        this.id = id;
        this.status = gameState.wait;
        this.players = new Map();
        this.time = time.day;
    }

    addPlayer(user) {
        if (this.players.has(user.id)) return false; // 이미 있어요

        const player = new Player(user);
        this.players.set(user.id, player);
        this.allPlayers += 1;

        console.log(user);

        return true;
    }

    removePlayer(user) {
        if (!this.players.has(user.id)) return false; // 없어요

        this.players.delete(user.id);

        return true;
    }

    isPlayer(user) {
        return this.players.has(user.id);
    }

    setDay() {
        return this.time = time.day;
    }

    setNight() {
        return this.time = time.night;
    }

    startGame() {
        const playerList = [...this.players.values()];
        assignRoles(playerList);

        for (const player of playerList) {
            player.sendDM(`당신의 역할은 ${[player.role.name]}`)
        }

        this.status = gameState.go;
    }

    cancelGame(room) {
        const playerList = [...this.players.values()];

        for (const player of playerList) {
            room.removePlayer(player);
        }

        this.status = gameState.end;
    }

    endGame(room) {
        this.cancelGame(room);

        // 보상
    }
}

function assignRoles(players) {
    const total = players.length;

    if (total < 4 || total > 8) throw new Error("인원 수는 4명 이상 8명 이하만 가능합니다.");

    const roles = [];
    const { mafia, citizen, police, doctor } = roleCountsByPlayer[total];

    for (let i = 0; i < mafia; i++)
        roles.push(new Mafia());
    for (let i = 0; i < citizen; i++)
        roles.push(new Citizen());
    for (let i = 0; i < police; i++)
        roles.push(new Police());
    for (let i = 0; i < doctor; i++)
        roles.push(new Doctor());

    shuffleArray(roles);

    for (let i = 0; i < players.length; i++) {
        players[i].setRole(roles[i]);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

exports.MafiaGameManager = MafiaGameManager;
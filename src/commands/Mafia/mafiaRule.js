const { Mafia, Citizen, Police, Doctor } = require("./mafiaRoles");

function assignRoles(players) {
    const total = players.length;

    if (total < 4 || total > 8) throw new Error("인원 수는 4명 이상 8명 이하만 가능합니다.");

    const roleCountsByPlayer = {
        4: { mafia: 1, citizen: 1, police: 1, doctor: 1 },
        5: { mafia: 1, citizen: 2, police: 1, doctor: 1 },
        6: { mafia: 2, citizen: 2, police: 1, doctor: 1 },
        7: { mafia: 2, citizen: 3, police: 1, doctor: 1 },
        8: { mafia: 3, citizen: 4, police: 1, doctor: 1 },
    };

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
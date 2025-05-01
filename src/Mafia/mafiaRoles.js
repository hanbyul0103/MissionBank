class Role {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}

class Mafia extends Role {
    constructor() {
        super(1, '마피아');
    }

    // 죽이기
    kill(target) {
        if (target.isAlive) {
            target.isAlive = false;
        }
    }
}

class Citizen extends Role {
    constructor() {
        super(2, '시민');
    }
}

class Police extends Role {
    constructor() {
        super(3, '경찰');
    }

    // 조사하기
    investigate(target) {
        return target.role instanceof Mafia;
    }
}

class Doctor extends Role {
    constructor() {
        super(4, '의사');
    }

    // 살리기
    heal(target) {
        target.isHealed = true;
    }
}

class Player {
    constructor(user) {
        this.id = user.id;
        this.userName = user.username;
        this.member = user;
        this.role = null;
        this.isAlive = true;
        this.voteCount = 0;
        this.votedPlayer = null;
        this.isHealed = false;
    }

    setRole(role) {
        this.role = role;
    }

    resetVote() {
        this.voteCount = 0;
        this.votedPlayer = null;
    }

    vote(target) {
        target.voteCount += 1;
        this.votedPlayer = target;
    }

    async sendDM(content) {
        try {
            await this.member.send(content);
        } catch (err) {
            console.log(`${this.member.user.username}에게 DM 보내기 실패`);
        }
    }
}

exports.Mafia = Mafia;
exports.Citizen = Citizen;
exports.Police = Police;
exports.Doctor = Doctor;
exports.Player = Player;
export class Friend {
    constructor(name, yourWins = 0, friendWins = 0, gameRequest = false) {
        this.name = name;
        this.yourWins = yourWins;
        this.friendWins = friendWins;
        this.gameRequest = gameRequest;
    }
}
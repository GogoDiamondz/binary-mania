export class Friend {
    constructor(user, yourWins = 0, friendWins = 0, gameRequest = false) {
        this.user = user;
        this.yourWins = yourWins;
        this.friendWins = friendWins;
        this.gameRequest = gameRequest;
    }
}
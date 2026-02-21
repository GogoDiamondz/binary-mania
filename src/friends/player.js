export class Player {
    constructor(name, friendStatus = 'none', yourWins = 0, friendWins = 0) {
        this.name = name;
        this.yourWins = yourWins;
        this.friendWins = friendWins;
        this.friendStatus = friendStatus; // 'none', 'pending', 'friend'
    }
}